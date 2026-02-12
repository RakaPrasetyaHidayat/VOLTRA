let redisClient;

if (process.env.NODE_ENV !== 'production') {
  const Redis = require('ioredis');
  redisClient = new Redis({
    host: '127.0.0.1',
    port: 6379
  });
} else {
  console.log('🚫 Redis disabled in production');
}


module.exports = redisClient;
