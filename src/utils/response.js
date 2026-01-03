module.exports = {
  success: (res, status = 200, data = null, message = null) => {
    const payload = { success: true };
    if (data !== null) payload.data = data;
    if (message) payload.message = message;
    return res.status(status).json(payload);
  },
};
