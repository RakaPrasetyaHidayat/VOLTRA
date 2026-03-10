const express = require('express');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();
require('reflect-metadata');
const { AppDataSource } = require('./src/config/typeorm');

AppDataSource.initialize()
  .then(() => {
    console.log('TypeORM Data Source initialized');
  })
  .catch((err) => {
    console.error('TypeORM initialization error', err);
  });

const authRoutes = require('./src/routes/authRoutes');
const testRoutes = require('./src/routes/testRoutes');
const serverRoutes = require('./src/routes/serverRoutes');
const channelRoutes = require('./src/routes/channelRoutes');
const subChannelRoutes = require('./src/routes/subChannelRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const errorMiddleware = require('./src/middleware/errorMiddleware');
const logger = require('./src/middleware/logger');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./src/config/swagger');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(compression());
app.use(logger);


app.get('/api-docs/swagger.json', (req, res) => res.json(swaggerDocs));

app.get('/api-docs', (req, res) => {
  const cssUrl = 'https://unpkg.com/swagger-ui-dist/swagger-ui.css';
  const bundleUrl = 'https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js';
  const presetUrl = 'https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js';

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>API Docs</title>
    <link rel="stylesheet" href="${cssUrl}" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="${bundleUrl}"></script>
    <script src="${presetUrl}"></script>
    <script>
      window.onload = function() {
        const ui = SwaggerUIBundle({
          url: '/api-docs/swagger.json',
          dom_id: '#swagger-ui',
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          layout: 'StandaloneLayout'
        });
        window.ui = ui;
      };
    </script>
  </body>
  </html>`;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
});

// Routes
/**
 * @swagger
 * /:
 *   get:
 *     summary: API info
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: API info
 */
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: ok
 */
const apiInfo = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to VOLTRA Backend API',
    version: '1.0.0',
    status: 'Operational',
    endpoints: {
      auth: '/api/auth',
      test: '/api/test',
      servers: '/api/servers',
      channels: '/api/channels',
      subChannels: '/api/sub-channels',
      tasks: '/api/tasks',
      docs: '/api-docs',
      health: '/health'
    }
  });
};

app.get('/', apiInfo);
app.get('/api', apiInfo);

app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/sub-channels', subChannelRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'VOLTRA Backend is running' });
});

// Error handling middleware
app.use(errorMiddleware);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
