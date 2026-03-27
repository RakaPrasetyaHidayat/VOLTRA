const response = {
  success: (res, status = 200, data = null, message = 'Success') => {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  },

  error: (res, status = 500, message = 'Internal Server Error', errors = null) => {
    return res.status(status).json({
      success: false,
      message,
      errors,
    });
  },
};

module.exports = response;
