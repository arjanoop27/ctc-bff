const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const subMissionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => randomUUID(), // UUID
    },

    missionId: {
      type: String,
      required: true, // FK -> Mission._id
      index: true,
    },

    associatedChallengeId: {
      type: String,
      required: true, // FK -> Challenge._id (UUID)
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    objective: {
      type: String,
      default: '',
      trim: true,
    },

    target: {
      type: String,
      default: '',
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },

    image: {
      type: String,
      default: '',
      trim: true,
    },

    status: {
      type: String,
      enum: ['locked', 'active', 'completed', 'disabled'],
      default: 'locked',
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

subMissionSchema.index({ missionId: 1, order: 1 });

const SubMission =
  mongoose.models.SubMission || mongoose.model('SubMission', subMissionSchema);

const SubMissionSwaggerSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string', format: 'uuid' },
    missionId: { type: 'string', format: 'uuid' },
    associatedChallengeId: { type: 'string', format: 'uuid' },
    title: { type: 'string', example: 'Silent Database Pull' },
    objective: {
      type: 'string',
      example: 'Extract sensitive records using SQL injection.',
    },
    target: { type: 'string', example: '/api/search' },
    difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'] },
    image: {
      type: 'string',
      example: '/images/missions/silent-database-pull.jpg',
    },
    status: {
      type: 'string',
      enum: ['locked', 'active', 'completed', 'disabled'],
    },
    order: { type: 'integer', example: 1 },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  required: ['_id', 'missionId', 'associatedChallengeId', 'title'],
};

module.exports = { SubMission, SubMissionSwaggerSchema };
