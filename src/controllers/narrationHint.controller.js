const { NarrationHint } = require('../models/narrationHint');

async function getNarrationHintsBySubMissionId(req, res, next) {
  try {
    const { id } = req.params;
    const narrationHints = await NarrationHint.find(
      { subMissionId: id },
      { id: 1, order: 1 },
    )
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return res.json({ ok: true, data: narrationHints });
  } catch (err) {
    return next(err);
  }
}

async function getNarrationHintsById(req, res, next) {
  try {
    const { id } = req.params;
    // TODO: Add logic to save in hint used history
    const narrationHints = await NarrationHint.findById(id).lean();
    return res.json({ ok: true, data: narrationHints });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getNarrationHintsBySubMissionId,
  getNarrationHintsById,
};
