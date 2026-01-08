const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const ctcThemeSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => randomUUID(), // UUID
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const CtcTheme =
  mongoose.models.CtcTheme || mongoose.model('CtcTheme', ctcThemeSchema);

const CtcThemeSwaggerSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string', format: 'uuid' },
    name: { type: 'string', example: 'Cyber Espionage' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  required: ['_id', 'name'],
};

module.exports = {
  CtcTheme,
  CtcThemeSwaggerSchema,
};
