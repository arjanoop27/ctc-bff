const bcrypt = require('bcrypt');
const { z } = require('zod');
const { User } = require('../models/user');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { UserContext } = require('../models/UserContext');
const { assignModeForNewUser } = require('../services/modeAssigner');

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

  const userContext = await UserContext.findOne({ _id:user._id });

  const token = jwt.sign(
    { userId: user._id, username: user.username, ctcMode: userContext.ctcMode },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    },
  );

  res.cookie('access_token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
  });

  return res.json({
    ok: true,
    data: { token },
  });
}

async function me(req, res) {
  return res.json({
    ok: true,
    data: {
      userId: req.user.userId,
      isAdmin: req.user.isAdmin,
      ctcMode: req.user.ctcMode,
    },
  });
}

function logout(req, res) {
  res.clearCookie('access_token', {
    httpOnly: true,
    sameSite: 'lax',
  });

  return res.json({ ok: true });
}

module.exports = {
  register,
  registerSchema,
  login,
  loginSchema,
  logout,
  me,
};
