const { randomUUID } = require('crypto');
const mongoose = require('mongoose');

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
  required: ['_id', 'description', 'createdAt', 'updatedAt'],
};

module.exports = {
  Challenge,
  ChallengeSwaggerSchema,
};
