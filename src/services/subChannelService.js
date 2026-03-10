const db = require('../config/db');
const redis = require('../config/redis');

const createSubChannel = async (channelId, name) => {
  const result = await db.query(
    'INSERT INTO sub_channels (channel_id, name) VALUES ($1, $2) RETURNING *',
    [channelId, name]
  );

  const saved = result.rows[0];

  try {
    await redis.del(`subchannels:${channelId}`);
  } catch (err) {
    console.warn('Cache invalidation error:', err.message);
  }

  return saved;
};

const getSubChannelsByChannel = async (channelId) => {
  const cacheKey = `subchannels:${channelId}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    console.warn('Redis get error:', err.message);
  }

  const result = await db.query(
    `SELECT sc.*, COALESCE(AVG(t.completion_percentage), 0) as average_progress
     FROM sub_channels sc
     LEFT JOIN tasks t ON sc.id = t.sub_channel_id
     WHERE sc.channel_id = $1
     GROUP BY sc.id
     ORDER BY sc.created_at DESC`,
    [channelId]
  );

  const items = result.rows.map(row => ({
    ...row,
    average_progress: parseFloat(row.average_progress).toFixed(2),
  }));

  try {
    await redis.setex(cacheKey, 60, JSON.stringify(items));
  } catch (err) {
    console.warn('Redis set error:', err.message);
  }

  return items;
};

const getSubChannelDetail = async (subChannelId) => {
  const cacheKey = `subchannel:${subChannelId}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    console.warn('Redis get error:', err.message);
  }

  const result = await db.query(
    `SELECT sc.*, COALESCE(COUNT(t.id), 0) as total_tasks,
            COALESCE(AVG(t.completion_percentage), 0) as average_progress
     FROM sub_channels sc
     LEFT JOIN tasks t ON sc.id = t.sub_channel_id
     WHERE sc.id = $1
     GROUP BY sc.id`,
    [subChannelId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const subChannel = {
    ...result.rows[0],
    total_tasks: parseInt(result.rows[0].total_tasks, 10),
    average_progress: parseFloat(result.rows[0].average_progress).toFixed(2),
  };

  try {
    await redis.setex(cacheKey, 300, JSON.stringify(subChannel));
  } catch (err) {
    console.warn('Redis set error:', err.message);
  }

  return subChannel;
};

const updateSubChannel = async (subChannelId, channelId, name) => {
  const result = await db.query(
    'UPDATE sub_channels SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [name, subChannelId]
  );

  if (result.rows.length > 0) {
    const cacheKey = `subchannels:${channelId}`;
    const detailCacheKey = `subchannel:${subChannelId}`;
    await redis.del(cacheKey);
    await redis.del(detailCacheKey);
  }

  return result.rows[0] || null;
};

const deleteSubChannel = async (subChannelId, channelId) => {
  await db.query('DELETE FROM sub_channels WHERE id = $1', [subChannelId]);

  const cacheKey = `subchannels:${channelId}`;
  const detailCacheKey = `subchannel:${subChannelId}`;
  await redis.del(cacheKey);
  await redis.del(detailCacheKey);
};

module.exports = {
  createSubChannel,
  getSubChannelsByChannel,
  getSubChannelDetail,
  updateSubChannel,
  deleteSubChannel,
};
