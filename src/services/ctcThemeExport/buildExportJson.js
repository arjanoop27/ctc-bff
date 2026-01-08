function buildExportJson({ theme, missions, subMissions, narrations, hints }) {
  const narrationBySubMissionId = new Map(
    narrations.map((n) => [n.subMissionId, n]),
  );

  const hintsByNarrationId = new Map();
  for (const h of hints) {
    const arr = hintsByNarrationId.get(h.narrationId) || [];
    arr.push(h);
    hintsByNarrationId.set(h.narrationId, arr);
  }

  const subMissionsByMissionId = new Map();
  for (const s of subMissions) {
    const arr = subMissionsByMissionId.get(s.missionId) || [];
    arr.push(s);
    subMissionsByMissionId.set(s.missionId, arr);
  }

  const exportJson = {
    id: theme._id,
    name: theme.name,
    missions: missions.map((m) => {
      const subs = subMissionsByMissionId.get(m._id) || [];

      return {
        id: m._id,
        title: m.title,
        subTitle: m.subTitle || '',
        image: m.image || '',
        status: m.status || 'active',
        order: m.order ?? 0,
        subMissions: subs.map((s) => {
          const nar = narrationBySubMissionId.get(s._id);
          const narHints = nar ? hintsByNarrationId.get(nar._id) || [] : [];

          const narrationBlock = nar
            ? {
                id: nar._id,
                roleTitle: nar.roleTitle || '',
                roleBrief: nar.roleBrief || '',
                narrationText: nar.narrationText || '',
                context: nar.context || '',
                target: nar.target || '',
                hints: narHints.map((h) => ({
                  id: h._id,
                  order: h.order ?? 0,
                  message: h.message,
                })),
              }
            : undefined;

          return {
            id: s._id,
            order: s.order ?? 0,
            title: s.title,
            objective: s.objective || '',
            target: s.target || '',
            difficulty: s.difficulty || 'Easy',
            status: s.status || 'locked',
            image: s.image || '',
            associatedChallengeId: s.associatedChallengeId,
            ...(narrationBlock ? { narration: narrationBlock } : {}),
          };
        }),
      };
    }),
  };

  return exportJson;
}

module.exports = { buildExportJson };
