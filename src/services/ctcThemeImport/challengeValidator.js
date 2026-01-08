const { Challenge } = require('../../models/Challenge');

function collectChallengeIds(payload) {
  return Array.from(
    new Set(
      payload.missions.flatMap((m) =>
        m.subMissions.map((s) => s.associatedChallengeId),
      ),
    ),
  );
}

async function assertChallengesExist(challengeIds) {
  if (challengeIds.length === 0) return;

  const existing = await Challenge.find(
    { _id: { $in: challengeIds } },
    { _id: 1 },
  ).lean();
  const existingSet = new Set(existing.map((x) => x._id));

  const missing = challengeIds.filter((id) => !existingSet.has(id));
  if (missing.length) {
    const err = new Error(
      'Some associatedChallengeId values do not exist in Challenge',
    );
    err.code = 'MISSING_CHALLENGES';
    err.details = missing;
    throw err;
  }
}

module.exports = { collectChallengeIds, assertChallengesExist };
