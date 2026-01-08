const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const narrationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => randomUUID(), // UUID
    },
    subMissionId: {
      type: String,
      required: true, // FK -> SubMission._id
      unique: true,
      index: true,
    },
    roleTitle: {
      type: String,
      default: '',
      trim: true,
    },
    roleBrief: {
      type: String,
      default: '',
      trim: true,
    },

    narrationText: {
      type: String,
      default: '',
      trim: true,
    },

    context: {
      type: String,
      default: '',
      trim: true,
    },

    target: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true },
);

const Narration =
  mongoose.models.Narration || mongoose.model('Narration', narrationSchema);

const NarrationSwaggerSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string', format: 'uuid' },
    subMissionId: { type: 'string', format: 'uuid' },

    roleTitle: { type: 'string', example: 'Agent' },
    roleBrief: {
      type: 'string',
      example: 'You are an agent investigating a suspected data leak.',
    },

    narrationText: { type: 'string' },
    context: { type: 'string' },
    target: { type: 'string' },

    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  required: ['_id', 'subMissionId'],
};

module.exports = { Narration, NarrationSwaggerSchema };
