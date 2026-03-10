const db = require('../config/db');
const crypto = require('crypto');

const generateInviteToken = async () => {
  let inviteToken;
  let tries = 0;
  
  do {
    if (tries++ > 10) {
      throw new Error('Failed to generate unique invite token');
    }
    const n = crypto.randomInt(0, 1000000);
    inviteToken = String(n).padStart(6, '0');
    
    const exists = await db.query('SELECT id FROM servers WHERE id = $1', [inviteToken]);
    if (exists.rows.length === 0) break;
  } while (true);

  return inviteToken;
};

const createServer = async (userId, name) => {
  const inviteToken = await generateInviteToken();

  const result = await db.query(
    'INSERT INTO servers (id, name, owner_id) VALUES ($1, $2, $3) RETURNING *',
    [inviteToken, name, userId],
    userId
  );

  const server = result.rows[0];

  await db.query(
    'INSERT INTO server_members (server_id, user_id, role) VALUES ($1, $2, $3)',
    [server.id, userId, 'admin'],
    userId
  );

  return {
    id: server.id,
    name: server.name,
    ownerId: server.owner_id,
    inviteToken: server.id,
    createdAt: server.created_at,
  };
};

const joinServer = async (userId, inviteToken) => {
  const serverResult = await db.query('SELECT id FROM servers WHERE id = $1', [inviteToken]);
  
  if (serverResult.rows.length === 0) {
    return null;
  }

  const serverId = serverResult.rows[0].id;

  await db.query(
    'INSERT INTO server_members (server_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [serverId, userId],
    userId
  );

  return { serverId };
};

const getServersByUser = async (userId) => {
  const result = await db.query(
    `SELECT s.* FROM servers s 
     JOIN server_members sm ON s.id = sm.server_id 
     WHERE sm.user_id = $1 
     ORDER BY s.created_at DESC`,
    [userId],
    userId
  );
  return result.rows;
};

const updateServer = async (serverId, userId, name) => {
  const serverResult = await db.query('SELECT * FROM servers WHERE id = $1', [serverId]);
  
  if (serverResult.rows.length === 0) {
    return null;
  }

  const server = serverResult.rows[0];
  if (server.owner_id !== userId) {
    throw new Error('Only the owner can edit this project');
  }

  const result = await db.query(
    'UPDATE servers SET name = $1 WHERE id = $2 RETURNING *',
    [name, serverId],
    userId
  );

  return result.rows[0];
};

const deleteServer = async (serverId, userId) => {
  const serverResult = await db.query('SELECT * FROM servers WHERE id = $1', [serverId]);
  
  if (serverResult.rows.length === 0) {
    return false;
  }

  const server = serverResult.rows[0];
  if (server.owner_id !== userId) {
    throw new Error('Only the owner can delete this project');
  }

  await db.query('DELETE FROM servers WHERE id = $1', [serverId], userId);
  return true;
};

const getServerMembers = async (serverId, userId) => {
  const result = await db.query(
    `SELECT sm.*, u.email, u.full_name, u.avatar_url 
     FROM server_members sm 
     JOIN users u ON sm.user_id = u.id 
     WHERE sm.server_id = $1`,
    [serverId],
    userId
  );
  return result.rows;
};

module.exports = {
  generateInviteToken,
  createServer,
  joinServer,
  getServersByUser,
  updateServer,
  deleteServer,
  getServerMembers,
};
