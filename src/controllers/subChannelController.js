const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const response = require('../utils/response');
const { validateString, validateNumber } = require('../middleware/validator');
const subChannelService = require('../services/subChannelService');

exports.create = asyncHandler(async (req, res, next) => {
  const { channelId, name } = req.body;

  if (!channelId || !name) {
    return next(new ErrorHandler('Channel ID and name are required', 400));
  }

  try {
    validateNumber(channelId, 'Channel ID');
    validateString(name, 'Sub-channel name', 1, 255);
  } catch (err) {
    return next(err);
  }

  const subChannel = await subChannelService.createSubChannel(channelId, name);
  return response.success(res, 201, subChannel, 'Sub-channel created successfully');
});

exports.getByChannel = asyncHandler(async (req, res, next) => {
  const { channelId } = req.params;

  try {
    validateNumber(channelId, 'Channel ID');
  } catch (err) {
    return next(err);
  }

  const subChannels = await subChannelService.getSubChannelsByChannel(channelId);
  return response.success(res, 200, subChannels);
});

exports.getDetail = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    validateNumber(id, 'Sub-channel ID');
  } catch (err) {
    return next(err);
  }

  const subChannel = await subChannelService.getSubChannelDetail(id);
  if (!subChannel) {
    return next(new ErrorHandler('Sub-channel not found', 404));
  }

  return response.success(res, 200, subChannel);
});

exports.update = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { channelId, name } = req.body;

  if (!name) {
    return next(new ErrorHandler('Sub-channel name is required', 400));
  }

  try {
    validateNumber(id, 'Sub-channel ID');
    validateNumber(channelId, 'Channel ID');
    validateString(name, 'Sub-channel name', 1, 255);
  } catch (err) {
    return next(err);
  }

  const subChannel = await subChannelService.updateSubChannel(id, channelId, name);
  if (!subChannel) {
    return next(new ErrorHandler('Sub-channel not found', 404));
  }

  return response.success(res, 200, subChannel, 'Sub-channel updated successfully');
});

exports.delete = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { channelId } = req.body;

  if (!channelId) {
    return next(new ErrorHandler('Channel ID is required', 400));
  }

  try {
    validateNumber(id, 'Sub-channel ID');
    validateNumber(channelId, 'Channel ID');
  } catch (err) {
    return next(err);
  }

  const subChannel = await subChannelService.getSubChannelDetail(id);
  if (!subChannel) {
    return next(new ErrorHandler('Sub-channel not found', 404));
  }

  await subChannelService.deleteSubChannel(id, channelId);
  return response.success(res, 200, null, 'Sub-channel deleted successfully');
});
