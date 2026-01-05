const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const response = require('../utils/response');
const { AppDataSource } = require('../config/typeorm');

async function getRepo() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource.getRepository('SubChannel');
}

exports.create = asyncHandler(async (req, res, next) => {
  const { channelId, name } = req.body;

  if (!channelId || !name) {
    return next(new ErrorHandler('Channel ID and name are required', 400));
  }

  const repo = await getRepo();
  const saved = await repo.save({ name, channelId });
  return response.success(res, 201, saved);
});

exports.getByChannel = asyncHandler(async (req, res, next) => {
  const { channelId } = req.params;
  const repo = await getRepo();
  const items = await repo.find({ where: { channelId: Number(channelId) } });
  return response.success(res, 200, items);
});
