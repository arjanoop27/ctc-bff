const bcrypt = require('bcrypt');
const { z } = require('zod');
const { User } = require('../models/user');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

async function register(req, res) {
  const { email, password } = req.body;

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
  });

  return res.status(201).json({
    ok: true,
    data: {
      id: user._id,
      email: user.email,
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

  const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
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
    },
  });
}

module.exports = {
  register,
  registerSchema,
  login,
  loginSchema,
  me,
};
