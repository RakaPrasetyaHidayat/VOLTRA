const db = require('../config/db');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const response = require('../utils/response');

exports.create = asyncHandler(async (req, res, next) => {
  const { subChannelId, name, details, completionPercentage, assignedUserId } = req.body;

  if (!subChannelId || !name) {
    return next(new ErrorHandler('Sub-channel ID and name are required', 400));
  }

  const result = await db.query(
    'INSERT INTO tasks (sub_channel_id, name, details, completion_percentage, assigned_user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [subChannelId, name, details, completionPercentage, assignedUserId]
  );
  return response.success(res, 201, result.rows[0]);
});

exports.getBySubChannel = asyncHandler(async (req, res, next) => {
  const { subChannelId } = req.params;
  const result = await db.query(`
    SELECT t.*, u.name as assigned_person_name 
    FROM tasks t 
    LEFT JOIN users u ON t.assigned_user_id = u.id 
    WHERE t.sub_channel_id = $1
  `, [subChannelId]);
  return response.success(res, 200, result.rows);
});

exports.updateProgress = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { completionPercentage } = req.body;

  if (completionPercentage === undefined) {
    return next(new ErrorHandler('Completion percentage is required', 400));
  }

  const result = await db.query(
    'UPDATE tasks SET completion_percentage = $1 WHERE id = $2 RETURNING *',
    [completionPercentage, id]
  );

  if (result.rows.length === 0) {
    return next(new ErrorHandler('Task not found', 404));
  }

  return response.success(res, 200, result.rows[0]);
});
