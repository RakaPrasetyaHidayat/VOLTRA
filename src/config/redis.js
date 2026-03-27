const Redis = require('ioredis');

let redisClient = null;

if (process.env.REDIS_URL) {
  try {
    redisClient = new Redis(process.env.REDIS_URL, {
      retryStrategy: (times) => Math.min(times * 50, 2000),
      enableReadyCheck: false,
      enableOfflineQueue: true,
      maxRetriesPerRequest: null,
    });

    redisClient.on('error', (err) => {
      console.warn('Redis connection error:', err.message);
    });

    redisClient.on('connect', () => {
      console.log('Redis connected successfully');
    });
  } catch (err) {
    console.warn('Redis initialization failed:', err.message);
    redisClient = null;
  }
} else {
  console.warn('REDIS_URL not configured - caching disabled');
}

const redisProxy = {
  get: async (key) => {
    if (!redisClient) return null;
    try {
      return await redisClient.get(key);
    } catch (err) {
      console.warn('Redis get error:', err.message);
      return null;
    }
  },

  set: async (key, value, ttl) => {
    if (!redisClient) return;
    try {
      if (ttl) {
        await redisClient.setex(key, ttl, value);
      } else {
        await redisClient.set(key, value);
      }
    } catch (err) {
      console.warn('Redis set error:', err.message);
    }
  },

  del: async (key) => {
    if (!redisClient) return;
    try {
      await redisClient.del(key);
    } catch (err) {
      console.warn('Redis delete error:', err.message);
    }
  },

  setex: async (key, ttl, value) => {
    if (!redisClient) return;
    try {
      await redisClient.setex(key, ttl, value);
    } catch (err) {
      console.warn('Redis setex error:', err.message);
    }
  },

  flushDb: async () => {
    if (!redisClient) return;
    try {
      await redisClient.flushdb();
    } catch (err) {
      console.warn('Redis flush error:', err.message);
    }
  },
};

module.exports = redisProxy;
