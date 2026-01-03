const db = require('../config/db');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const response = require('../utils/response');

exports.create = asyncHandler(async (req, res, next) => {
  const { serverId, name, description, techStack, background, problemToSolve } = req.body;

  if (!serverId || !name) {
    return next(new ErrorHandler('Server ID and name are required', 400));
  }

  const result = await db.query(
    'INSERT INTO channels (server_id, name, description, tech_stack, background, problem_to_solve) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [serverId, name, description, techStack, background, problemToSolve]
  );
  return response.success(res, 201, result.rows[0]);
});

exports.getByServer = asyncHandler(async (req, res, next) => {
  const { serverId } = req.params;
  const result = await db.query('SELECT * FROM channels WHERE server_id = $1', [serverId]);
  return response.success(res, 200, result.rows);
});

exports.getDetail = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const result = await db.query('SELECT * FROM channels WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return next(new ErrorHandler('Channel not found', 404));
  }
  return response.success(res, 200, result.rows[0]);
});
