const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { UserContext } = require('../models/userContext');

async function authMiddleware(req, res, next) {
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

    const userId = payload.userId;
    const ctx = await UserContext.findById(userId).lean();

    req.user = {
      userId: payload.userId,
      isAdmin: ctx?.isAdmin === true,
      ctcMode: ctx?.ctcMode || 'vanilla',
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
