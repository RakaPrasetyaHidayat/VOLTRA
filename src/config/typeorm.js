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

async function ensureInitialized() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
}

async function getRepository(entityName) {
  await ensureInitialized();
  return AppDataSource.getRepository(entityName);
}

module.exports = { AppDataSource, ensureInitialized, getRepository };
