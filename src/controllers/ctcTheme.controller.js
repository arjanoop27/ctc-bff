const {
  importTheme,
} = require('../services/ctcThemeImport/importThemeService');

async function importThemeFromJson(req, res, next) {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ ok: false, error: 'Missing file field "file"' });
    }

    const raw = req.file.buffer.toString('utf-8');

    let json;
    try {
      json = JSON.parse(raw);
    } catch (e) {
      return res
        .status(400)
        .json({ ok: false, error: 'Uploaded file is not valid JSON' });
    }

    const debug = req.query.debug === '1';
    const data = await importTheme(json, { debug });

    return res.status(201).json({ ok: true, data });
  } catch (err) {
    return next(err);
  }
}

async function exportThemeAsJson(req, res) {
  return res.status(501).json({
    ok: false,
    error: 'Not implemented yet: exportThemeAsJson',
  });
}

module.exports = {
  importThemeFromJson,
  exportThemeAsJson,
};
