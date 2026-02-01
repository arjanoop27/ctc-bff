const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const hintUsageMetricSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => randomUUID() },

    hintId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },

    usedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    _id: false,
  },
);

hintUsageMetricSchema.index({ hintId: 1, userId: 1 });

const HintUsageMetric =
  mongoose.models.HintUsageMetric ||
  mongoose.model('HintUsageMetric', hintUsageMetricSchema);

module.exports = { HintUsageMetric };
