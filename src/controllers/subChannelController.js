const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const response = require('../utils/response');
const { getRepository } = require('../config/typeorm');
const redis = require('../config/redis');

// controllers should use getRepository helper for consistent init

exports.create = asyncHandler(async (req, res, next) => {
  const { channelId, name } = req.body;

  if (!channelId || !name) {
    return next(new ErrorHandler('Channel ID and name are required', 400));
  }

  const repo = await getRepository('SubChannel');
  const saved = await repo.save({ name, channelId });
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

  const repo = await getRepository('SubChannel');
  const items = await repo.find({ select: ['id', 'name', 'channelId', 'createdAt'], where: { channelId: Number(channelId) } });

  // cache result for short TTL
  try {
    await redis.setex(cacheKey, 60, JSON.stringify(items));
  } catch (err) {
    console.warn('Redis set failed', err);
  }

  return response.success(res, 200, items);
});
