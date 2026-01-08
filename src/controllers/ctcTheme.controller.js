const {
  importTheme,
} = require('../services/ctcThemeImport/importThemeService');
const {
  boolParam,
  exportTheme,
} = require('../services/ctcThemeExport/exportThemeService');
const { deleteCtcTheme } = require('../services/deleteCtcThemeService');

const { CtcTheme } = require('../models/CtcTheme');

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

async function exportThemeAsJson(req, res, next) {
  try {
    const themeId = req.params.id;
    const includeIds = boolParam(req.query.includeIds);

    const { themeName, exportJson } = await exportTheme(themeId, {
      includeIds,
    });

    const safeName = (themeName || 'theme')
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/gi, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '');

    const filename = `${safeName || themeId}.json`;

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    return res.status(200).send(JSON.stringify(exportJson, null, 2));
  } catch (err) {
    if (err?.code === 'THEME_NOT_FOUND') {
      return res.status(404).json({ ok: false, error: 'Theme not found' });
    }
    return next(err);
  }
}

async function deleteCtcThemeHandler(req, res, next) {
  try {
    const themeId = req.params.id;
    const debug = req.query.debug === '1';

    const data = await deleteCtcTheme(themeId, { debug });

    return res.json({ ok: true, data });
  } catch (err) {
    if (err?.code === 'THEME_NOT_FOUND') {
      return res.status(404).json({ ok: false, error: 'Theme not found' });
    }
    return next(err);
  }
}

async function getAllThemes(req, res, next) {
  try {
    const themes = await CtcTheme.find({}, { name: 1 })
      .sort({ createdAt: -1 })
      .lean();
    const data = themes.map((t) => ({ _id: t._id, name: t.name }));
    return res.json({ ok: true, data });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  importThemeFromJson,
  exportThemeAsJson,
  deleteCtcThemeHandler,
  getAllThemes,
};
