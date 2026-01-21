const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const bcrypt = require('bcrypt');
const { env } = require('../config/env');

function signAccessToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN_MIN + 'm' || '15m',
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

function generateRefreshTokenPlain() {
  return randomUUID() + randomUUID();
}

async function hashRefreshToken(plain) {
  return bcrypt.hash(plain, 10);
}

async function compareRefreshToken(plain, hash) {
  return bcrypt.compare(plain, hash);
}

function refreshExpiryDate() {
  const days = Number(env.REFRESH_TOKEN_EXPIRES_DAYS || 7);
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  generateRefreshTokenPlain,
  hashRefreshToken,
  compareRefreshToken,
  refreshExpiryDate,
};
