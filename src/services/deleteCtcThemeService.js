const mongoose = require('mongoose');

const { CtcTheme } = require('../models/CtcTheme');
const { Mission } = require('../models/Mission');
const { SubMission } = require('../models/SubMission');
const { Narration } = require('../models/Narration');
const { NarrationHint } = require('../models/NarrationHint');

async function deleteCtcTheme(themeId, { debug = false } = {}) {
  const session = await mongoose.startSession();

  let result = {
    themeId,
    counts: {
      missions: 0,
      subMissions: 0,
      narrations: 0,
      hints: 0,
      themeDeleted: 0,
    },
  };

  try {
    await session.withTransaction(async () => {
      const theme = await CtcTheme.findById(themeId).session(session);
      if (!theme) {
        const err = new Error('Theme not found');
        err.code = 'THEME_NOT_FOUND';
        throw err;
      }
      if (debug) console.log('[delete] theme', themeId);

      const missions = await Mission.find({ ctcThemeId: themeId }, { _id: 1 })
        .session(session)
        .lean();

      const missionIds = missions.map((m) => m._id);
      result.counts.missions = missionIds.length;

      if (debug) console.log('[delete] missions', missionIds.length);

      const subMissions = await SubMission.find(
        { missionId: { $in: missionIds } },
        { _id: 1 },
      )
        .session(session)
        .lean();

      const subMissionIds = subMissions.map((s) => s._id);
      result.counts.subMissions = subMissionIds.length;

      if (debug) console.log('[delete] subMissions', subMissionIds.length);

      const narrations = await Narration.find(
        { subMissionId: { $in: subMissionIds } },
        { _id: 1 },
      )
        .session(session)
        .lean();

      const narrationIds = narrations.map((n) => n._id);
      result.counts.narrations = narrationIds.length;

      if (debug) console.log('[delete] narrations', narrationIds.length);

      if (narrationIds.length > 0) {
        const delHints = await NarrationHint.deleteMany({
          narrationId: { $in: narrationIds },
        }).session(session);

        result.counts.hints = delHints.deletedCount || 0;

        if (debug) console.log('[delete] hints', result.counts.hints);
      }

      if (subMissionIds.length > 0) {
        await Narration.deleteMany({
          subMissionId: { $in: subMissionIds },
        }).session(session);
      }

      if (missionIds.length > 0) {
        await SubMission.deleteMany({
          missionId: { $in: missionIds },
        }).session(session);
      }

      await Mission.deleteMany({
        ctcThemeId: themeId,
      }).session(session);

      const delTheme = await CtcTheme.deleteOne({ _id: themeId }).session(
        session,
      );
      result.counts.themeDeleted = delTheme.deletedCount || 0;

      if (debug) console.log('[delete] themeDeleted');
    });

    return result;
  } finally {
    session.endSession();
  }
}

module.exports = { deleteCtcTheme };
