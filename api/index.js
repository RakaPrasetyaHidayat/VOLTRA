const app = require('../app');

// Vercel serverless handler: export a function that calls the Express app
module.exports = (req, res) => app(req, res);
