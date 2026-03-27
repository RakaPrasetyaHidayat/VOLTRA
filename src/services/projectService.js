const db = require('../config/db');
const redis = require('../config/redis');

const createProject = async (serverId, name, description, techStack, background, problemToSolve) => {
  const result = await db.query(
    `INSERT INTO channels (server_id, name, description, tech_stack, background, problem_to_solve) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [serverId, name, description, techStack, background, problemToSolve]
  );
  return result.rows[0];
};

const getProjectsByServer = async (serverId) => {
  const result = await db.query(
    'SELECT * FROM channels WHERE server_id = $1 ORDER BY created_at DESC',
    [serverId]
  );
  return result.rows;
};

const getProjectDetail = async (projectId) => {
  const cacheKey = `project:${projectId}`;
  
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    console.warn('Redis get error:', err.message);
  }

  const result = await db.query(
    'SELECT * FROM channels WHERE id = $1',
    [projectId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const project = result.rows[0];

  try {
    await redis.setex(cacheKey, 300, JSON.stringify(project));
  } catch (err) {
    console.warn('Redis set error:', err.message);
  }

  return project;
};

const updateProject = async (projectId, name, description, techStack, background, problemToSolve) => {
  const result = await db.query(
    `UPDATE channels 
     SET name = $1, description = $2, tech_stack = $3, background = $4, problem_to_solve = $5 
     WHERE id = $6 RETURNING *`,
    [name, description, techStack, background, problemToSolve, projectId]
  );

  if (result.rows.length > 0) {
    const cacheKey = `project:${projectId}`;
    await redis.del(cacheKey);
  }

  return result.rows[0];
};

const deleteProject = async (projectId) => {
  await db.query('DELETE FROM channels WHERE id = $1', [projectId]);
  
  const cacheKey = `project:${projectId}`;
  await redis.del(cacheKey);
};

module.exports = {
  createProject,
  getProjectsByServer,
  getProjectDetail,
  updateProject,
  deleteProject,
};
