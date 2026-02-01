const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const challengeMetricSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => randomUUID() },

    challengeId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },

    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    _id: false,
  },
);

challengeMetricSchema.index({ userId: 1, challengeId: 1, startedAt: -1 });
challengeMetricSchema.index({ userId: 1, challengeId: 1, createdAt: -1 });

const ChallengeMetric =
  mongoose.models.ChallengeMetric ||
  mongoose.model('ChallengeMetric', challengeMetricSchema);

module.exports = { ChallengeMetric };
