const redis = require('../config/redis');
const ErrorHandler = require('../utils/errorHandler');

const createRateLimiter = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  return async (req, res, next) => {
    if (!redis) {
      return next();
    }

    const identifier = req.user?.id || req.ip;
    const key = `ratelimit:${identifier}`;

    try {
      const current = await redis.get(key);
      
      if (current !== null && parseInt(current, 10) >= maxRequests) {
        return next(new ErrorHandler('Too many requests, please try again later', 429));
      }

      if (current === null) {
        await redis.set(key, '1');
        await redis.set(key, 1, Math.ceil(windowMs / 1000));
      } else {
        const newCount = parseInt(current, 10) + 1;
        await redis.set(key, String(newCount));
      }

      res.set('X-RateLimit-Limit', maxRequests);
      res.set('X-RateLimit-Remaining', maxRequests - (parseInt(current, 10) || 0));

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
