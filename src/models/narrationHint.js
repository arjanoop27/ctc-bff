const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const narrationHintSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => randomUUID() },

    narrationId: {
      type: String,
      required: true, // FK -> Narration._id
      index: true,
    },

    subMissionId: {
      type: String,
      required: true, // FK -> SubMission._id
      index: true,
    },

    order: { type: Number, default: 0 },

    message: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

narrationHintSchema.index({ narrationId: 1, order: 1 }, { unique: true });

narrationHintSchema.index({ subMissionId: 1, order: 1 });

const NarrationHint =
  mongoose.models.NarrationHint ||
  mongoose.model('NarrationHint', narrationHintSchema);

module.exports = { NarrationHint };
