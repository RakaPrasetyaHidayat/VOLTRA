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
    query: async (text, params, userId) => {
      const client = await pool.connect();
      try {
        if (userId) {
          await client.query('BEGIN');
          await client.query('SELECT set_config($1, $2, true)', ['app.current_user_id', String(userId)]);
          const res = await client.query(text, params);
          await client.query('COMMIT');
          return res;
        } else {
          return await client.query(text, params);
        }
      } catch (e) {
        if (userId) await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    },
    pool,
  };
}
