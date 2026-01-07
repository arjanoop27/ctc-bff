const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const hintSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => randomUUID() },
    order: { type: Number, default: 0 },
    message: { type: String, required: true },
  },
  { _id: false },
);

const narrationSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => randomUUID() },
    narration: { type: String, default: '' },
    context: { type: String, default: '' },
    target: { type: String, default: '' },
    hints: { type: [hintSchema], default: [] },
  },
  { _id: false },
);

const missionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    order: { type: Number, default: 0 },
    title: { type: String, default: '' },
    objective: { type: String, default: '' },
    tags: { type: [String], default: [] },
    narration: { type: narrationSchema, default: () => ({}) },
  },
  { _id: false },
);

const missionThemeSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => randomUUID() },
    title: { type: String, default: '' },
    tagline: { type: String, default: '' },
    tags: { type: [String], default: [] },
    isAvailable: { type: Boolean, default: true },
    imgSrc: { type: String, default: '' },

    missions: { type: [missionSchema], default: [] },
  },
  { _id: false },
);

const narrativeConfigSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    name: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    version: { type: Number, default: 1 },
    updatedBy: { type: String, default: '' },
    missionThemes: { type: [missionThemeSchema], default: [] },
  },
  { timestamps: true },
);

const NarrativeConfig =
  mongoose.models.NarrativeConfig ||
  mongoose.model('NarrativeConfig', narrativeConfigSchema);

const NarrativeConfigSwaggerSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string', format: 'uuid' },
    name: { type: 'string', example: 'Season 1 - Noir' },
    status: { type: 'string', enum: ['draft', 'published'], example: 'draft' },
    version: { type: 'integer', example: 1 },
    updatedBy: { type: 'string', format: 'uuid' },

    missionThemes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          tagline: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          isAvailable: { type: 'boolean' },
          imgSrc: { type: 'string' },

          missions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'CTC-001' },
                order: { type: 'integer', example: 1 },
                title: { type: 'string' },
                objective: { type: 'string' },
                tags: { type: 'array', items: { type: 'string' } },
                narration: {
                  type: 'object',
                  properties: {
                    narration: { type: 'string' },
                    context: { type: 'string' },
                    target: { type: 'string' },
                    hints: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', format: 'uuid' },
                          order: { type: 'integer' },
                          message: { type: 'string' },
                        },
                        required: ['id', 'message'],
                      },
                    },
                  },
                },
              },
              required: ['id'],
            },
          },
        },
        required: ['id'],
      },
    },

    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  required: ['_id', 'status', 'missionThemes'],
};

module.exports = { NarrativeConfig, NarrativeConfigSwaggerSchema };
