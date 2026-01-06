const { UserContext } = require('../models/UserContext');

async function adminOnly(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    const ctx = await UserContext.findById(userId).lean();
    if (!ctx || ctx.isAdmin !== true) {
      return res
        .status(403)
        .json({ ok: false, error: 'Admin access required' });
    }

    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = adminOnly;
