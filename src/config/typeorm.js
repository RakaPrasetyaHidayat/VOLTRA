const path = require('path');
const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  synchronize: false,
  logging: false,
  entities: [path.join(__dirname, '..', 'entities', '*.js')],
  extra: {
    max: 20,
  },
});

module.exports = { AppDataSource };
