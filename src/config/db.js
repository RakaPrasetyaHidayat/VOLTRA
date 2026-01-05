const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL not set — database calls will return an informative error');

  module.exports = {
    query: () => {
      return Promise.reject(new Error('No DATABASE_URL configured in environment'));
    },
    pool: null,
  };
} else {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: Number(process.env.DB_MAX_CLIENTS) || 20, // Max clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });

  module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
  };
}
