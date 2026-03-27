const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const response = require('../utils/response');
const { validateString, validateNumber } = require('../middleware/validator');
const channelService = require('../services/channelService');

exports.create = asyncHandler(async (req, res, next) => {
  const { serverId, name, description, techStack, background, problemToSolve } = req.body;

  if (!serverId || !name) {
    return next(new ErrorHandler('Server ID and name are required', 400));
  }

  try {
    validateNumber(serverId, 'Server ID');
    validateString(name, 'Channel name', 1, 255);
  } catch (err) {
    return next(err);
  }

  const userId = req.user.id;
  const channel = await channelService.createChannel(serverId, name, description, techStack, background, problemToSolve);
  return response.success(res, 201, channel, 'Channel created successfully');
});

exports.getByServer = asyncHandler(async (req, res, next) => {
  const { serverId } = req.params;

  try {
    validateNumber(serverId, 'Server ID');
  } catch (err) {
    return next(err);
  }

  const channels = await channelService.getChannelsByServer(serverId);
  return response.success(res, 200, channels);
});

exports.getDetail = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    validateNumber(id, 'Channel ID');
  } catch (err) {
    return next(err);
  }

  const channel = await channelService.getChannelDetail(id);
  if (!channel) {
    return next(new ErrorHandler('Channel not found', 404));
  }

  return response.success(res, 200, channel);
});

exports.update = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, techStack, background, problemToSolve } = req.body;

  if (!name) {
    return next(new ErrorHandler('Channel name is required', 400));
  }

  try {
    validateNumber(id, 'Channel ID');
    validateString(name, 'Channel name', 1, 255);
  } catch (err) {
    return next(err);
  }

  const channel = await channelService.updateChannel(id, name, description, techStack, background, problemToSolve);
  if (!channel) {
    return next(new ErrorHandler('Channel not found', 404));
  }

  return response.success(res, 200, channel, 'Channel updated successfully');
});

exports.delete = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    validateNumber(id, 'Channel ID');
  } catch (err) {
    return next(err);
  }

  const channel = await channelService.getChannelDetail(id);
  if (!channel) {
    return next(new ErrorHandler('Channel not found', 404));
  }

  await channelService.deleteChannel(id);
  return response.success(res, 200, null, 'Channel deleted successfully');
});
