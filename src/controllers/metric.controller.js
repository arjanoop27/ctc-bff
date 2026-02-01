const { ChallengeMetric } = require('../models/challengeMetric');
const { Challenge } = require('../models/challenge');

async function startChallenge(req, res, next) {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const challengeId = id;

    if (!challengeId) {
      return res.status(400).json({ ok: false, error: 'Missing challenge id' });
    } else {
      const validChallenge = await Challenge.findById(challengeId).lean();
      if (!validChallenge) {
        return res.status(400).json({ ok: false, error: 'Invalid Challenge' });
      }
    }

    const now = new Date();

    const latest = await ChallengeMetric.findOne({ userId, challengeId })
      .sort({ startedAt: -1, createdAt: -1 })
      .exec();

    if (!latest) {
      await ChallengeMetric.create({
        userId,
        challengeId,
        startedAt: now,
        completedAt: null,
      });
      return res.status(201).json({ ok: true });
    }

    if (!latest.completedAt) {
      latest.startedAt = now;
      await latest.save();
      return res.status(200).json({ ok: true });
    }

    const created = await ChallengeMetric.create({
      userId,
      challengeId,
      startedAt: now,
      completedAt: null,
    });

    return res.status(201).json({ ok: true, data: created, newAttempt: true });
  } catch (err) {
    return next(err);
  }
}

async function completeChallenge(req, res, next) {
  try {
    const userId = req.user?.userId;
    const { challengeId } = req.body;
    if (!challengeId) {
      return res
        .status(400)
        .json({ ok: false, error: 'Missing challenge Key' });
    }

    const solvedChallenge = await Challenge.findOne({
      key: challengeId,
    }).lean();
    if (!solvedChallenge) {
      return res
        .status(400)
        .json({ ok: false, error: 'Invalid Challenge Key' });
    }

    const solvedChallengeId = solvedChallenge._id;
    const now = new Date();

    const openAttempt = await ChallengeMetric.findOne({
      userId,
      challengeId: solvedChallengeId,
      completedAt: null,
    })
      .sort({ startedAt: -1, createdAt: -1 })
      .exec();

    if (!openAttempt) {
      return res.status(404).json({
        ok: false,
        error: 'No active challenge attempt found to complete',
      });
    }

    // Known issue
    if (openAttempt.startedAt instanceof Date) {
      const elapsedMs = now.getTime() - openAttempt.startedAt.getTime();
      if (elapsedMs >= 0 && elapsedMs < 2500) {
        return res.status(409).json({
          ok: false,
          error: 'Known issue: CHALLENGE_COMPLETE_TOO_SOON after start',
          elapsedMs,
        });
      }
    }

    openAttempt.completedAt = now;
    await openAttempt.save();

    return res.status(200).json({
      ok: true,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  startChallenge,
  completeChallenge,
};
