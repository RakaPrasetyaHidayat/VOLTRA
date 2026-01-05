// Lightweight in-memory cache middleware for hot endpoints (LRU-like)
const LRU = require('lru-cache');

const cache = new LRU({ max: 500, ttl: 1000 * 60 }); // default 60s

function cacheMiddleware(keyFn, ttlSeconds = 60) {
  return async (req, res, next) => {
    try {
      const key = typeof keyFn === 'function' ? keyFn(req) : keyFn;
      const cached = cache.get(key);
      if (cached) {
        return res.json(cached);
      }

      // hook into res.json to capture response
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        try {
          cache.set(key, body, { ttl: ttlSeconds * 1000 });
        } catch (e) {
          // swallow cache errors
        }
        return originalJson(body);
      };

      return next();
    } catch (err) {
      return next();
    }
  };
}

module.exports = { cacheMiddleware, cache };
