const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const ctcRoutes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./config/swagger');

function createApp() {
  const app = express();

  // core middleware
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('dev'));

  // routes
  app.use('/ctc', ctcRoutes);
  app.use('/ctc/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // 404
  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });

  // error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    if (err && err.message && err.message.includes('Only .json files')) {
      return res.status(400).json({ ok: false, error: err.message });
    }
    if (err && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ ok: false, error: 'File too large' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  });

  return app;
}

module.exports = { createApp };
