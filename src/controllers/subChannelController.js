const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const response = require('../utils/response');
const db = require('../config/db');
const redis = require('../config/redis');

exports.create = asyncHandler(async (req, res, next) => {
  const { channelId, name } = req.body;

  if (!channelId || !name) {
    return next(new ErrorHandler('Channel ID and name are required', 400));
  }

  const userId = req.user.id;
  const result = await db.query(
    'INSERT INTO sub_channels (channel_id, name) VALUES ($1, $2) RETURNING *',
    [channelId, name],
    userId
  );
  const saved = result.rows[0];

  // invalidate cache for this channel
  try {
    await redis.del(`subchannels:${channelId}`);
  } catch (err) {
    console.warn('Failed to invalidate cache', err);
  }
  return response.success(res, 201, saved);
});

exports.getByChannel = asyncHandler(async (req, res, next) => {
  const { channelId } = req.params;
  const userId = req.user.id;
  const cacheKey = `subchannels:${channelId}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      return response.success(res, 200, parsed);
    }
  } catch (err) {
    console.warn('Redis get failed', err);
  }

  const result = await db.query(`
    SELECT sc.*, COALESCE(AVG(t.completion_percentage), 0) as average_progress
    FROM sub_channels sc
    LEFT JOIN tasks t ON sc.id = t.sub_channel_id
    WHERE sc.channel_id = $1
    GROUP BY sc.id
  `, [channelId], userId);

  const items = result.rows.map(row => ({
    ...row,
    average_progress: parseFloat(row.average_progress).toFixed(2)
  }));

  // cache result for short TTL
  try {
    await redis.setex(cacheKey, 60, JSON.stringify(items));
  } catch (err) {
    console.warn('Redis set failed', err);
  }

  return response.success(res, 200, items);
});
