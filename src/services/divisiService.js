const db = require('../config/db');
const redis = require('../config/redis');

const createDivisi = async (projectId, name) => {
  const result = await db.query(
    'INSERT INTO sub_channels (channel_id, name) VALUES ($1, $2) RETURNING *',
    [projectId, name]
  );

  const saved = result.rows[0];

  try {
    await redis.del(`divisies:${projectId}`);
  } catch (err) {
    console.warn('Cache invalidation error:', err.message);
  }

  return saved;
};

const getDivisisByProject = async (projectId) => {
  const cacheKey = `divisies:${projectId}`;

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
    [projectId]
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

const getDivisiDetail = async (divisiId) => {
  const cacheKey = `divisi:${divisiId}`;

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
    [divisiId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const divisi = {
    ...result.rows[0],
    total_tasks: parseInt(result.rows[0].total_tasks, 10),
    average_progress: parseFloat(result.rows[0].average_progress).toFixed(2),
  };

  try {
    await redis.setex(cacheKey, 300, JSON.stringify(divisi));
  } catch (err) {
    console.warn('Redis set error:', err.message);
  }

  return divisi;
};

const updateDivisi = async (divisiId, projectId, name) => {
  const result = await db.query(
    'UPDATE sub_channels SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [name, divisiId]
  );

  if (result.rows.length > 0) {
    const cacheKey = `divisies:${projectId}`;
    const detailCacheKey = `divisi:${divisiId}`;
    await redis.del(cacheKey);
    await redis.del(detailCacheKey);
  }

  return result.rows[0] || null;
};

const deleteDivisi = async (divisiId, projectId) => {
  await db.query('DELETE FROM sub_channels WHERE id = $1', [divisiId]);

  const cacheKey = `divisies:${projectId}`;
  const detailCacheKey = `divisi:${divisiId}`;
  await redis.del(cacheKey);
  await redis.del(detailCacheKey);
};

module.exports = {
  createDivisi,
  getDivisisByProject,
  getDivisiDetail,
  updateDivisi,
  deleteDivisi,
};
