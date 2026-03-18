const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const challengeSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
    key: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    difficulty: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) =>
          Array.isArray(arr) && arr.every((t) => typeof t === 'string'),
        message: 'tags must be an array of strings',
      },
    },
  },
  {
    timestamps: true,
    _id: false,
  },
);

challengeSchema.index({ category: 1, difficulty: 1 });
challengeSchema.index({ tags: 1 });
challengeSchema.index({ key: 1 });

const Challenge =
  mongoose.models.Challenge || mongoose.model('Challenge', challengeSchema);

const ChallengeSwaggerSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string', format: 'uuid' },
    name: { type: 'string', description: 'Challenge name' },
    description: { type: 'string', description: 'Challenge description' },
    category: { type: 'string', description: 'Challenge category' },
    difficulty: {
      type: 'number',
      description: 'Difficulty level (1-10)',
      minimum: 1,
      maximum: 10,
    },
    tags: {
      type: 'array',
      items: { type: 'string' },
      description: 'Tags for filtering/search',
    },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  required: ['_id', 'name', 'description', 'category', 'difficulty', 'tags'],
};

module.exports = {
  Challenge,
  ChallengeSwaggerSchema,
};
