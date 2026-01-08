const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const missionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },

    ctcThemeId: {
      type: String,
      required: true, // FK -> CtcTheme._id
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    subTitle: {
      type: String,
      default: '',
      trim: true,
    },

    image: {
      type: String,
      default: '',
      trim: true,
    },

    status: {
      type: String,
      enum: ['active', 'coming_soon', 'disabled'],
      default: 'coming_soon',
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

missionSchema.index({ ctcThemeId: 1, order: 1 });

const Mission =
  mongoose.models.Mission || mongoose.model('Mission', missionSchema);

const MissionSwaggerSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string', format: 'uuid' },
    ctcThemeId: { type: 'string', format: 'uuid' },
    title: { type: 'string', example: 'Digital Mayhem' },
    subTitle: {
      type: 'string',
      example: 'Public defacement. Viral attacks. User manipulation.',
    },
    image: { type: 'string', example: 'https://example.com/image.png' },
    status: { type: 'string', enum: ['active', 'coming_soon', 'disabled'] },
    order: { type: 'integer', example: 1 },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  required: ['_id', 'ctcThemeId', 'title'],
};

module.exports = { Mission, MissionSwaggerSchema };
