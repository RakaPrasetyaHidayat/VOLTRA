const db = require('../config/db');
const crypto = require('crypto');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const response = require('../utils/response');

exports.create = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const userId = req.user.id;

  if (!name) return next(new ErrorHandler('Server name is required', 400));
  // Generate a unique 6-digit numeric invite token (e.g. 123456)
  let inviteToken;
  let tries = 0;
  do {
    if (tries++ > 10) return next(new ErrorHandler('Failed to generate unique invite token', 500));
    const n = crypto.randomInt(0, 1000000);
    inviteToken = String(n).padStart(6, '0');
    // check uniqueness (global check, bypass RLS)
    const exists = await db.query('SELECT id FROM servers WHERE invite_token = $1', [inviteToken]);
    if (exists.rows.length === 0) break;
  } while (true);

  const result = await db.query(
    'INSERT INTO servers (name, owner_id, invite_token) VALUES ($1, $2, $3) RETURNING *',
    [name, userId, inviteToken],
    userId
  );
  
  const server = result.rows[0];

  await db.query(
    'INSERT INTO server_members (server_id, user_id, role) VALUES ($1, $2, $3)',
    [server.id, userId, 'admin'],
    userId
  );

  // return server info including invite token so frontend can display it
  return response.success(res, 201, {
    id: server.id,
    name: server.name,
    ownerId: server.owner_id,
    inviteToken: server.invite_token,
    createdAt: server.created_at,
  });
});

exports.join = asyncHandler(async (req, res, next) => {
  const { inviteToken } = req.body;
  const userId = req.user.id;

  if (!inviteToken) return next(new ErrorHandler('Invite token is required', 400));

  const serverResult = await db.query('SELECT id FROM servers WHERE invite_token = $1', [inviteToken]);
  if (serverResult.rows.length === 0) {
    return next(new ErrorHandler('Server not found', 404));
  }

  const serverId = serverResult.rows[0].id;

  await db.query(
    'INSERT INTO server_members (server_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [serverId, userId],
    userId
  );

  return response.success(res, 200, { serverId }, 'Joined server successfully');
});

exports.getAll = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const result = await db.query(
    'SELECT s.* FROM servers s JOIN server_members sm ON s.id = sm.server_id WHERE sm.user_id = $1',
    [userId],
    userId
  );
  return response.success(res, 200, result.rows);
});
