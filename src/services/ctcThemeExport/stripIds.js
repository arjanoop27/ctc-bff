function stripIds(exportJson) {
  const clone = JSON.parse(JSON.stringify(exportJson));
  delete clone.id;
  for (const mission of clone.missions || []) {
    delete mission.id;
    for (const sub of mission.subMissions || []) {
      delete sub.id;
      if (sub.narration) {
        delete sub.narration.id;
        for (const h of sub.narration.hints || []) {
          delete h.id;
        }
      }
    }
  }
  return clone;
}

module.exports = { stripIds };
