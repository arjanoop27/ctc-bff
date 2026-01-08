const { CtcTheme } = require('../../models/CtcTheme');
const { Mission } = require('../../models/Mission');
const { SubMission } = require('../../models/SubMission');
const { Narration } = require('../../models/Narration');
const { NarrationHint } = require('../../models/NarrationHint');

async function fetchThemeTree(themeId) {
  const theme = await CtcTheme.findById(themeId).lean();
  if (!theme) {
    const err = new Error('Theme not found');
    err.code = 'THEME_NOT_FOUND';
    throw err;
  }

  const missions = await Mission.find({ ctcThemeId: themeId })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  const missionIds = missions.map((m) => m._id);

  const subMissions = await SubMission.find({ missionId: { $in: missionIds } })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  const subMissionIds = subMissions.map((s) => s._id);

  const narrations = await Narration.find({
    subMissionId: { $in: subMissionIds },
  }).lean();

  const narrationIds = narrations.map((n) => n._id);

  const hints = await NarrationHint.find({ narrationId: { $in: narrationIds } })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  return { theme, missions, subMissions, narrations, hints };
}

module.exports = { fetchThemeTree };
