const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const response = require('../utils/response');
const { validateString } = require('../middleware/validator');
const serverService = require('../services/serverService');

exports.create = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const userId = req.user.id;

  if (!name) {
    return next(new ErrorHandler('Server name is required', 400));
  }

  try {
    validateString(name, 'Server name', 1, 255);
  } catch (err) {
    return next(err);
  }

  const server = await serverService.createServer(userId, name);
  return response.success(res, 201, server, 'Server created successfully');
});

exports.join = asyncHandler(async (req, res, next) => {
  const { inviteToken } = req.body;
  const userId = req.user.id;

  if (!inviteToken) {
    return next(new ErrorHandler('Invite token is required', 400));
  }

  try {
    validateString(inviteToken, 'Invite token', 1, 10);
  } catch (err) {
    return next(err);
  }

  const result = await serverService.joinServer(userId, inviteToken);
  if (!result) {
    return next(new ErrorHandler('Server not found', 404));
  }

  return response.success(res, 200, result, 'Joined server successfully');
});

exports.getAll = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const servers = await serverService.getServersByUser(userId);
  return response.success(res, 200, servers);
});

exports.update = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const userId = req.user.id;

  if (!name) {
    return next(new ErrorHandler('Server name is required', 400));
  }

  try {
    validateString(name, 'Server name', 1, 255);
  } catch (err) {
    return next(err);
  }

  try {
    const server = await serverService.updateServer(id, userId, name);
    if (!server) {
      return next(new ErrorHandler('Server not found', 404));
    }
    return response.success(res, 200, server, 'Server updated successfully');
  } catch (err) {
    if (err.message.includes('Only the owner')) {
      return next(new ErrorHandler(err.message, 403));
    }
    throw err;
  }
});

exports.delete = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const deleted = await serverService.deleteServer(id, userId);
    if (!deleted) {
      return next(new ErrorHandler('Server not found', 404));
    }
    return response.success(res, 200, null, 'Server deleted successfully');
  } catch (err) {
    if (err.message.includes('Only the owner')) {
      return next(new ErrorHandler(err.message, 403));
    }
    throw err;
  }
});

exports.getMembers = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const members = await serverService.getServerMembers(id, userId);
  return response.success(res, 200, members);
});
