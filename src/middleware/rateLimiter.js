const redis = require('../config/redis');
const ErrorHandler = require('../utils/errorHandler');

const createRateLimiter = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  return async (req, res, next) => {
    if (!redis) {
      return next();
    }

    const identifier = req.user?.id || req.ip;
    const key = `ratelimit:${identifier}`;
    const ttlSeconds = Math.ceil(windowMs / 1000);

    try {
      const current = await redis.get(key);

      if (current !== null && parseInt(current, 10) >= maxRequests) {
        return next(new ErrorHandler('Too many requests, please try again later', 429));
      }

      if (current === null) {
        // First request — set counter with TTL in a single atomic call
        await redis.setex(key, ttlSeconds, '1');
      } else {
        // Increment counter (TTL already set from first call)
        const newCount = parseInt(current, 10) + 1;
        await redis.set(key, String(newCount));
      }

      const count = parseInt(current, 10) || 0;
      res.set('X-RateLimit-Limit', String(maxRequests));
      res.set('X-RateLimit-Remaining', String(Math.max(0, maxRequests - count - 1)));

      next();
    } catch (err) {
      console.warn('Rate limiter error:', err.message);
      next();
    }
  };
};

const authRateLimiter = createRateLimiter(15 * 60 * 1000, 10);
const apiRateLimiter = createRateLimiter(15 * 60 * 1000, 100);

module.exports = {
  createRateLimiter,
  authRateLimiter,
  apiRateLimiter,
};
