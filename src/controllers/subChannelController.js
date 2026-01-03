const db = require('../config/db');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const response = require('../utils/response');

exports.create = asyncHandler(async (req, res, next) => {
  const { channelId, name } = req.body;

  if (!channelId || !name) {
    return next(new ErrorHandler('Channel ID and name are required', 400));
  }

  const result = await db.query(
    'INSERT INTO sub_channels (channel_id, name) VALUES ($1, $2) RETURNING *',
    [channelId, name]
  );
  return response.success(res, 201, result.rows[0]);
});

exports.getByChannel = asyncHandler(async (req, res, next) => {
  const { channelId } = req.params;
  const result = await db.query('SELECT * FROM sub_channels WHERE channel_id = $1', [channelId]);
  return response.success(res, 200, result.rows);
});
