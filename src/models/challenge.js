const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const challengeSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    _id: false,
  },
);

const Challenge =
  mongoose.models.Challenge || mongoose.model('Challenge', challengeSchema);

const ChallengeSwaggerSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string', format: 'uuid' },
    description: {
      type: 'string',
      description: 'Challenge Description',
    },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  required: ['_id', 'description'],
};

module.exports = {
  Challenge,
  ChallengeSwaggerSchema,
};
