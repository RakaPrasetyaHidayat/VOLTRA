const db = require('../config/db');

const createTask = async (subChannelId, name, details, completionPercentage = 0, assignedUserId = null) => {
  const result = await db.query(
    `INSERT INTO tasks (sub_channel_id, name, details, completion_percentage, assigned_user_id) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [subChannelId, name, details, completionPercentage, assignedUserId]
  );
  return result.rows[0];
};

const getTasksBySubChannel = async (subChannelId) => {
  const result = await db.query(
    `SELECT t.*, u.username as assigned_person_name 
     FROM tasks t 
     LEFT JOIN users u ON t.assigned_user_id = u.id 
     WHERE t.sub_channel_id = $1
     ORDER BY t.created_at DESC`,
    [subChannelId]
  );
  return result.rows;
};

const getTaskDetail = async (taskId) => {
  const result = await db.query(
    `SELECT t.*, u.username as assigned_person_name 
     FROM tasks t 
     LEFT JOIN users u ON t.assigned_user_id = u.id 
     WHERE t.id = $1`,
    [taskId]
  );
  return result.rows[0] || null;
};

const updateTaskProgress = async (taskId, completionPercentage) => {
  if (completionPercentage < 0 || completionPercentage > 100) {
    throw new Error('Completion percentage must be between 0 and 100');
  }

  const result = await db.query(
    'UPDATE tasks SET completion_percentage = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [completionPercentage, taskId]
  );

  return result.rows[0] || null;
};

const updateTask = async (taskId, name, details, completionPercentage = null, assignedUserId = null) => {
  let query = 'UPDATE tasks SET ';
  const params = [];
  let paramIndex = 1;

  if (name !== undefined) {
    query += `name = $${paramIndex}, `;
    params.push(name);
    paramIndex++;
  }

  if (details !== undefined) {
    query += `details = $${paramIndex}, `;
    params.push(details);
    paramIndex++;
  }

  if (completionPercentage !== undefined && completionPercentage !== null) {
    if (completionPercentage < 0 || completionPercentage > 100) {
      throw new Error('Completion percentage must be between 0 and 100');
    }
    query += `completion_percentage = $${paramIndex}, `;
    params.push(completionPercentage);
    paramIndex++;
  }

  if (assignedUserId !== undefined) {
    query += `assigned_user_id = $${paramIndex}, `;
    params.push(assignedUserId);
    paramIndex++;
  }

  query += `updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`;
  params.push(taskId);

  const result = await db.query(query, params);
  return result.rows[0] || null;
};

const deleteTask = async (taskId) => {
  await db.query('DELETE FROM tasks WHERE id = $1', [taskId]);
};

const getTaskStats = async (subChannelId) => {
  const result = await db.query(
    `SELECT 
      COUNT(*) as total_tasks,
      SUM(CASE WHEN completion_percentage = 100 THEN 1 ELSE 0 END) as completed_tasks,
      AVG(completion_percentage) as average_progress,
      MAX(completion_percentage) as max_progress,
      MIN(completion_percentage) as min_progress
     FROM tasks 
     WHERE sub_channel_id = $1`,
    [subChannelId]
  );
  
  return {
    totalTasks: parseInt(result.rows[0].total_tasks, 10),
    completedTasks: parseInt(result.rows[0].completed_tasks, 10) || 0,
    averageProgress: parseFloat(result.rows[0].average_progress || 0).toFixed(2),
    maxProgress: parseInt(result.rows[0].max_progress, 10) || 0,
    minProgress: parseInt(result.rows[0].min_progress, 10) || 0,
  };
};

module.exports = {
  createTask,
  getTasksBySubChannel,
  getTaskDetail,
  updateTaskProgress,
  updateTask,
  deleteTask,
  getTaskStats,
};
