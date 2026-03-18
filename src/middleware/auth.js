const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { UserContext } = require('../models/userContext');

function getTokenFromRequest(req) {
  const cookieToken = req.cookies?.access_token;
  if (cookieToken) return cookieToken;

  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.split(' ')[1];
  }

  return null;
}

async function authMiddleware(req, res, next) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({
      ok: false,
      error: 'Missing or invalid Authentication token',
    });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);

    const userId = payload.userId;
    const ctx = await UserContext.findById(userId).lean();

    req.user = {
      userId: payload.userId,
      isAdmin: ctx?.isAdmin === true,
      ctcMode: ctx?.ctcMode || 'vanilla',
      token: token,
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
