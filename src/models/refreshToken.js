const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const refreshTokenSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    userId: { type: String, required: true, index: true },

    tokenHash: { type: String, required: true },

    expiresAt: { type: Date, required: true, index: true },

    revokedAt: { type: Date, default: null },
    replacedByTokenId: { type: String, default: null },
  },
  { timestamps: true },
);

refreshTokenSchema.index({ userId: 1, revokedAt: 1 });

const RefreshToken =
  mongoose.models.RefreshToken ||
  mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = { RefreshToken };
