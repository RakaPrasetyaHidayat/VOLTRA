const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const response = require('../utils/response');
const { validateString, validateNumber, validateCompletionPercentage } = require('../middleware/validator');
const taskService = require('../services/taskService');

exports.create = asyncHandler(async (req, res, next) => {
  const { subChannelId, name, details, completionPercentage = 0, assignedUserId } = req.body;

  if (!subChannelId || !name) {
    return next(new ErrorHandler('Sub-channel ID and name are required', 400));
  }

  try {
    validateNumber(subChannelId, 'Sub-channel ID');
    validateString(name, 'Task name', 1, 255);
    if (completionPercentage !== undefined) {
      validateCompletionPercentage(completionPercentage);
    }
  } catch (err) {
    return next(err);
  }

  const task = await taskService.createTask(subChannelId, name, details, completionPercentage, assignedUserId);
  return response.success(res, 201, task, 'Task created successfully');
});

exports.getBySubChannel = asyncHandler(async (req, res, next) => {
  const { subChannelId } = req.params;

  try {
    validateNumber(subChannelId, 'Sub-channel ID');
  } catch (err) {
    return next(err);
  }

  const tasks = await taskService.getTasksBySubChannel(subChannelId);
  return response.success(res, 200, tasks);
});

exports.getDetail = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    validateNumber(id, 'Task ID');
  } catch (err) {
    return next(err);
  }

  const task = await taskService.getTaskDetail(id);
  if (!task) {
    return next(new ErrorHandler('Task not found', 404));
  }

  return response.success(res, 200, task);
});

exports.updateProgress = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { completionPercentage } = req.body;

  if (completionPercentage === undefined) {
    return next(new ErrorHandler('Completion percentage is required', 400));
  }

  try {
    validateNumber(id, 'Task ID');
    validateCompletionPercentage(completionPercentage);
  } catch (err) {
    return next(err);
  }

  const task = await taskService.updateTaskProgress(id, completionPercentage);
  if (!task) {
    return next(new ErrorHandler('Task not found', 404));
  }

  return response.success(res, 200, task, 'Task progress updated successfully');
});

exports.update = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, details, completionPercentage, assignedUserId } = req.body;

  try {
    validateNumber(id, 'Task ID');
    if (name) validateString(name, 'Task name', 1, 255);
    if (completionPercentage !== undefined) validateCompletionPercentage(completionPercentage);
  } catch (err) {
    return next(err);
  }

  const task = await taskService.updateTask(id, name, details, completionPercentage, assignedUserId);
  if (!task) {
    return next(new ErrorHandler('Task not found', 404));
  }

  return response.success(res, 200, task, 'Task updated successfully');
});

exports.delete = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    validateNumber(id, 'Task ID');
  } catch (err) {
    return next(err);
  }

  const task = await taskService.getTaskDetail(id);
  if (!task) {
    return next(new ErrorHandler('Task not found', 404));
  }

  await taskService.deleteTask(id);
  return response.success(res, 200, null, 'Task deleted successfully');
});

exports.getStats = asyncHandler(async (req, res, next) => {
  const { subChannelId } = req.params;

  try {
    validateNumber(subChannelId, 'Sub-channel ID');
  } catch (err) {
    return next(err);
  }

  const stats = await taskService.getTaskStats(subChannelId);
  return response.success(res, 200, stats);
});
