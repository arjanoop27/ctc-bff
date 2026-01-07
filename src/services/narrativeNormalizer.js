const { randomUUID } = require('crypto');

function normalizeNarrativeConfig(config) {
  const seenMissionIds = new Set();

  config.missionThemes = config.missionThemes || [];

  for (const theme of config.missionThemes) {
    if (!theme.id) theme.id = randomUUID();

    theme.missions = theme.missions || [];
    theme.missions.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    for (const mission of theme.missions) {
      if (!mission.id || typeof mission.id !== 'string') {
        throw new Error(
          'Each mission must have a non-empty string id (e.g., CTC-001)',
        );
      }

      if (seenMissionIds.has(mission.id)) {
        throw new Error(`Duplicate mission id: ${mission.id}`);
      }
      seenMissionIds.add(mission.id);

      if (!mission.narration.id) mission.narration.id = randomUUID();
      mission.narration = mission.narration || {};
      mission.narration.hints = mission.narration.hints || [];

      for (const hint of mission.narration.hints) {
        if (!hint.id) hint.id = randomUUID();
      }
    }
  }

  return config;
}

module.exports = { normalizeNarrativeConfig };
