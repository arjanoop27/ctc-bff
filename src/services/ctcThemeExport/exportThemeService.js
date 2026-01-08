const { fetchThemeTree } = require('./fetchThemeTree');
const { buildExportJson } = require('./buildExportJson');
const { stripIds } = require('./stripIds');

function boolParam(v) {
  if (v === undefined) return false;
  return v === '1' || v === 'true' || v === 'yes';
}

async function exportTheme(themeId, { includeIds = false } = {}) {
  const tree = await fetchThemeTree(themeId);
  const full = buildExportJson(tree);
  const json = includeIds ? full : stripIds(full);
  return { themeName: tree.theme.name, exportJson: json };
}

module.exports = { exportTheme, boolParam };
