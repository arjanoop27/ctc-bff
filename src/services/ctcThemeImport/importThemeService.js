const mongoose = require('mongoose');
const { validateImportPayload } = require('./validatePayload');
const {
  collectChallengeIds,
  assertChallengesExist,
} = require('./challengeValidator');
const {
  createTheme,
  createMission,
  createSubMission,
  createNarration,
  createHints,
} = require('./createThemeTree');

async function importTheme(body, { debug = false } = {}) {
  const payload = validateImportPayload(body);
  const challengeIds = collectChallengeIds(payload);
  await assertChallengesExist(challengeIds);

  const session = await mongoose.startSession();
  let result = null;

  try {
    await session.withTransaction(async () => {
      const counts = { missions: 0, subMissions: 0, narrations: 0, hints: 0 };

      const theme = await createTheme(session, payload.name);
      if (debug) console.log('[import] theme', theme._id);

      for (const m of payload.missions) {
        const mission = await createMission(session, theme._id, m);
        counts.missions += 1;
        if (debug) console.log('[import] mission', mission._id);

        for (const s of m.subMissions) {
          const sub = await createSubMission(session, mission._id, s);
          counts.subMissions += 1;
          if (debug) console.log('[import] subMission', sub._id);

          if (s.narration) {
            const nar = await createNarration(session, sub._id, s.narration);
            counts.narrations += 1;
            if (debug) console.log('[import] narration', nar._id);

            counts.hints += await createHints(
              session,
              nar._id,
              sub._id,
              s.narration.hints,
            );
          }
        }
      }

      result = { themeId: theme._id, counts };
    });

    return result;
  } finally {
    session.endSession();
  }
}

module.exports = { importTheme };
