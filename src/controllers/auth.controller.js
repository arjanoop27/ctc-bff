const bcrypt = require('bcrypt');
const { z } = require('zod');
const { User } = require('../models/user');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { UserContext } = require('../models/UserContext');
const { assignModeForNewUser } = require('../services/modeAssigner');
const { RefreshToken } = require('../models/RefreshToken');
const {
  signAccessToken,
  generateRefreshTokenPlain,
  hashRefreshToken,
  refreshExpiryDate,
  compareRefreshToken,
} = require('../utility/tokens');

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(5),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

async function register(req, res) {
  const { email, password, username } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({
      ok: false,
      error: 'User already exists',
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    passwordHash,
    username,
  });

  const assignedMode = await assignModeForNewUser();

  await UserContext.create({
    _id: user._id,
    isAdmin: false,
    ctcMode: assignedMode,
  });

  return res.status(201).json({
    ok: true,
    data: {
      id: user._id,
      email: user.email,
      ctcMode: assignedMode,
      username: user.username,
      createdAt: user.createdAt,
    },
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Invalid credentials' });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ ok: false, error: 'Invalid credentials' });
  }

  const userContext = await UserContext.findOne({ _id: user._id });

  const token = jwt.sign(
    { userId: user._id, username: user.username, ctcMode: userContext.ctcMode },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN_MIN + 'm',
    },
  );

  const refreshTokenPlain = generateRefreshTokenPlain();
  const refreshTokenHash = await hashRefreshToken(refreshTokenPlain);

 await RefreshToken.create([
    {
      userId: user._id,
      tokenHash: refreshTokenHash,
      expiresAt: refreshExpiryDate(),
    },
  ]);

  res.cookie('access_token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: env.JWT_EXPIRES_IN_MIN * 60 * 1000,
  });

  res.cookie('refresh_token', refreshTokenPlain, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: Number(env.REFRESH_TOKEN_EXPIRES_DAYS) * 24 * 60 * 60 * 1000,
  });

  return res.json({
    ok: true,
    data: { token },
  });
}

async function me(req, res) {
  const user = await User.findById(req.user.userId).lean();
  return res.json({
    ok: true,
    data: {
      userId: req.user.userId,
      username: user.username,
      ctcMode: req.user.ctcMode,
    },
  });
}

async function logout(req, res, next) {
  try {
    const refreshPlain = req.cookies?.refresh_token;

    if (refreshPlain) {
      const candidates = await RefreshToken.find({ revokedAt: null }).lean();
      for (const t of candidates) {
        const ok = await compareRefreshToken(refreshPlain, t.tokenHash);
        if (ok) {
          await RefreshToken.updateOne(
            { _id: t._id },
            { $set: { revokedAt: new Date() } },
          );
          break;
        }
      }
    }

    const secure = env.NODE_ENV === 'production';

    res.clearCookie('access_token', {
      httpOnly: true,
      secure,
      sameSite: 'lax',
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure,
      sameSite: 'lax',
    });

    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const refreshPlain = req.cookies?.refresh_token;
    if (!refreshPlain) {
      return res
        .status(401)
        .json({ ok: false, error: 'Missing refresh token' });
    }

    const candidates = await RefreshToken.find({
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    }).lean();

    let matched = null;
    for (const t of candidates) {
      const ok = await compareRefreshToken(refreshPlain, t.tokenHash);
      if (ok) {
        matched = t;
        break;
      }
    }

    if (!matched) {
      return res
        .status(401)
        .json({ ok: false, error: 'Invalid refresh token' });
    }

    const user = await User.findById(matched.userId).lean();
    if (!user)
      return res
        .status(401)
        .json({ ok: false, error: 'Invalid refresh token' });

    const ctx = await UserContext.findById(matched.userId).lean();

    const newRefreshPlain = generateRefreshTokenPlain();
    const newRefreshHash = await hashRefreshToken(newRefreshPlain);

    const newDoc = await RefreshToken.create({
      userId: matched.userId,
      tokenHash: newRefreshHash,
      expiresAt: refreshExpiryDate(),
    });

    await RefreshToken.updateOne(
      { _id: matched._id },
      { $set: { revokedAt: new Date(), replacedByTokenId: newDoc._id } },
    );

    const accessToken = signAccessToken({
      userId: matched.userId,
      username: user.username,
      ctcMode: ctx.ctcMode,
    });

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: env.JWT_EXPIRES_IN_MIN * 60 * 1000,
    });

    res.cookie('refresh_token', newRefreshPlain, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: Number(env.REFRESH_TOKEN_EXPIRES_DAYS) * 24 * 60 * 60 * 1000,
    });

    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  register,
  registerSchema,
  login,
  loginSchema,
  logout,
  refresh,
  me,
};
