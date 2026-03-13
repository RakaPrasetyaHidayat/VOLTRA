const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const response = require('../utils/response');
const { validateString, validateNumber } = require('../middleware/validator');
const projectService = require('../services/projectService');

exports.create = asyncHandler(async (req, res, next) => {
  const { serverId, name, description, techStack, background, problemToSolve } = req.body;

  if (!serverId || !name) {
    return next(new ErrorHandler('Server ID and name are required', 400));
  }

  try {
    validateNumber(serverId, 'Server ID');
    validateString(name, 'Project name', 1, 255);
  } catch (err) {
    return next(err);
  }

  const userId = req.user.id;
  const project = await projectService.createProject(serverId, name, description, techStack, background, problemToSolve);
  return response.success(res, 201, project, 'Project created successfully');
});

exports.getByServer = asyncHandler(async (req, res, next) => {
  const { serverId } = req.params;

  try {
    validateNumber(serverId, 'Server ID');
  } catch (err) {
    return next(err);
  }

  const projects = await projectService.getProjectsByServer(serverId);
  return response.success(res, 200, projects);
});

exports.getDetail = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    validateNumber(id, 'Project ID');
  } catch (err) {
    return next(err);
  }

  const project = await projectService.getProjectDetail(id);
  if (!project) {
    return next(new ErrorHandler('Project not found', 404));
  }

  return response.success(res, 200, project);
});

exports.update = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, techStack, background, problemToSolve } = req.body;

  if (!name) {
    return next(new ErrorHandler('Project name is required', 400));
  }

  try {
    validateNumber(id, 'Project ID');
    validateString(name, 'Project name', 1, 255);
  } catch (err) {
    return next(err);
  }

  const project = await projectService.updateProject(id, name, description, techStack, background, problemToSolve);
  if (!project) {
    return next(new ErrorHandler('Project not found', 404));
  }

  return response.success(res, 200, project, 'Project updated successfully');
});

exports.delete = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    validateNumber(id, 'Project ID');
  } catch (err) {
    return next(err);
  }

  const project = await projectService.getProjectDetail(id);
  if (!project) {
    return next(new ErrorHandler('Project not found', 404));
  }

  await projectService.deleteProject(id);
  return response.success(res, 200, null, 'Project deleted successfully');
});
