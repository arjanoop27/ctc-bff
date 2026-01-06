const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      ok: false,
      error: 'Missing or invalid Authorization header',
    });
  }

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);

    req.user = {
      userId: payload.userId,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      ok: false,
      error: 'Invalid or expired token',
    });
  }
}

module.exports = authMiddleware;
