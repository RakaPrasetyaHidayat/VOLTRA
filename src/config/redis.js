let redisClient;

if (process.env.NODE_ENV !== 'production') {
  let Redis = null;
if (process.env.REDIS_URL) {
  const redis = require('ioredis');
  redisClient = new redis(process.env.REDIS_URL);
}

} else {
  console.log('🚫 Redis disabled in production');
}


module.exports = redisClient;
