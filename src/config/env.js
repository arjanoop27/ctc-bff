const dotenv = require('dotenv');
dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 4000),
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-me',
  JWT_EXPIRES_IN_MIN: Number(process.env.JWT_EXPIRES_IN || 15),
  REFRESH_TOKEN_EXPIRES_DAYS: Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS || 7),
};

module.exports = { env };
