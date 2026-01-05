const express = require('express');
const cors = require('cors');
const passport = require('./src/config/passport');
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
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./src/config/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Swagger Documentation
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css";
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { customCssUrl: CSS_URL }));

// Routes
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
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
