const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const response = require('../utils/response');
const { validateString, validateNumber } = require('../middleware/validator');
const divisiService = require('../services/divisiService');

exports.create = asyncHandler(async (req, res, next) => {
  const { projectId, name } = req.body;

  if (!projectId || !name) {
    return next(new ErrorHandler('Project ID and name are required', 400));
  }

  try {
    validateNumber(projectId, 'Project ID');
    validateString(name, 'Division name', 1, 255);
  } catch (err) {
    return next(err);
  }

  const divisi = await divisiService.createDivisi(projectId, name);
  return response.success(res, 201, divisi, 'Division created successfully');
});

exports.getByProject = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  try {
    validateNumber(projectId, 'Project ID');
  } catch (err) {
    return next(err);
  }

  const divisies = await divisiService.getDivisisByProject(projectId);
  return response.success(res, 200, divisies);
});

exports.getDetail = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    validateNumber(id, 'Division ID');
  } catch (err) {
    return next(err);
  }

  const divisi = await divisiService.getDivisiDetail(id);
  if (!divisi) {
    return next(new ErrorHandler('Division not found', 404));
  }

  return response.success(res, 200, divisi);
});

exports.update = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { projectId, name } = req.body;

  if (!name) {
    return next(new ErrorHandler('Division name is required', 400));
  }

  try {
    validateNumber(id, 'Division ID');
    validateNumber(projectId, 'Project ID');
    validateString(name, 'Division name', 1, 255);
  } catch (err) {
    return next(err);
  }

  const divisi = await divisiService.updateDivisi(id, projectId, name);
  if (!divisi) {
    return next(new ErrorHandler('Division not found', 404));
  }

  return response.success(res, 200, divisi, 'Division updated successfully');
});

exports.delete = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { projectId } = req.body;

  if (!projectId) {
    return next(new ErrorHandler('Project ID is required', 400));
  }

  try {
    validateNumber(id, 'Division ID');
    validateNumber(projectId, 'Project ID');
  } catch (err) {
    return next(err);
  }

  const divisi = await divisiService.getDivisiDetail(id);
  if (!divisi) {
    return next(new ErrorHandler('Division not found', 404));
  }

  await divisiService.deleteDivisi(id, projectId);
  return response.success(res, 200, null, 'Division deleted successfully');
});
