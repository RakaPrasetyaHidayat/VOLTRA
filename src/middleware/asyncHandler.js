/**
 * Bungkus promise supaya gak usah pakai try-catch di tiap controller
 */
module.exports = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
