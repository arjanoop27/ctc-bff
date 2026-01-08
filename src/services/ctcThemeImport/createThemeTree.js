const { CtcTheme } = require('../../models/CtcTheme');
const { Mission } = require('../../models/Mission');
const { SubMission } = require('../../models/SubMission');
const { Narration } = require('../../models/Narration');
const { NarrationHint } = require('../../models/NarrationHint');

async function createTheme(session, name) {
  const [theme] = await CtcTheme.create([{ name }], { session });
  return theme;
}

async function createMission(session, ctcThemeId, m) {
  const [mission] = await Mission.create(
    [
      {
        ctcThemeId,
        title: m.title,
        subTitle: m.subTitle || '',
        image: m.image || '',
        status: m.status || 'active',
        order: m.order ?? 0,
      },
    ],
    { session },
  );
  return mission;
}

async function createSubMission(session, missionId, s) {
  const [sub] = await SubMission.create(
    [
      {
        missionId,
        associatedChallengeId: s.associatedChallengeId,
        title: s.title,
        objective: s.objective || '',
        target: s.target || '',
        difficulty: s.difficulty || 'Easy',
        status: s.status || 'locked',
        image: s.image || '',
        order: s.order,
      },
    ],
    { session },
  );
  return sub;
}

async function createNarration(session, subMissionId, n) {
  const [nar] = await Narration.create(
    [
      {
        subMissionId,
        roleTitle: n.roleTitle || '',
        roleBrief: n.roleBrief || '',
        narrationText: n.narrationText || '',
        context: n.context || '',
        target: n.target || '',
      },
    ],
    { session },
  );
  return nar;
}

async function createHints(session, narrationId, subMissionId, hints) {
  const sorted = (hints || []).slice().sort((a, b) => a.order - b.order);
  let count = 0;

  for (const h of sorted) {
    await NarrationHint.create(
      [
        {
          narrationId,
          subMissionId,
          order: h.order,
          message: h.message,
        },
      ],
      { session },
    );
    count += 1;
  }
  return count;
}

module.exports = {
  createTheme,
  createMission,
  createSubMission,
  createNarration,
  createHints,
};
