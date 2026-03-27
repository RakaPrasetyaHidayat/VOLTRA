const logger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 500 ? 'ERROR' : res.statusCode >= 400 ? 'WARN' : 'INFO';
    const userId = req.user?.id ? ` [User: ${req.user.id}]` : '';
    
    console.log(
      `[${level}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms${userId}`
    );
  });

  next();
};

module.exports = logger;
