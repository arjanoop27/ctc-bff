const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: 'ctc-settings',
    },

    activeCtcTheme: {
      type: String,
      default: '',
    },

    assignmentStrategy: {
      type: String,
      enum: ['fixed', 'random', 'iterative'],
      default: 'fixed',
    },

    fixedMode: {
      type: String,
      enum: ['vanilla', 'narrative'],
      default: 'vanilla',
    },

    iterativeModes: {
      type: [String],
      default: ['narrative', 'vanilla'],
    },

    iterativeIndex: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Settings =
  mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

const SettingsSwaggerSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string', example: 'ctc-settings' },
    activeCtcTheme: { type: 'string', format: 'uuid', example: '' },
    assignmentStrategy: {
      type: 'string',
      enum: ['fixed', 'random', 'iterative'],
      example: 'fixed',
    },
    fixedMode: {
      type: 'string',
      enum: ['vanilla', 'narrative'],
      example: 'vanilla',
    },
    iterativeModes: {
      type: 'array',
      items: { type: 'string', enum: ['vanilla', 'narrative'] },
      example: ['narrative', 'vanilla'],
    },
    iterativeIndex: { type: 'integer', example: 0 },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

module.exports = { Settings, SettingsSwaggerSchema };
