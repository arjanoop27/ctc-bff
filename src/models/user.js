const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    _id: false,
  },
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

const UserSwaggerSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string', format: 'uuid' },
    email: { type: 'string', format: 'email' },
    passwordHash: {
      type: 'string',
      description: 'bcrypt hash',
    },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  required: ['_id', 'email', 'passwordHash', 'createdAt', 'updatedAt'],
};

module.exports = {
  User,
  UserSwaggerSchema,
};
