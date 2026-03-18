const { NarrationHint } = require('../models/narrationHint');
const { HintUsageMetric } = require('../models/hintUsageMetric');

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
    const { userId } = req.user;
    const requestedHint  = await NarrationHint.findById(id).lean();
    if (!requestedHint) {
      return res.status(404).json({
        ok: false,
        message: 'Hint not found.',
      });
    }

    const currentOrder = requestedHint.order ?? 0;
    if (currentOrder !== 1) {
      const predecessorHint = await NarrationHint.findOne({
        subMissionId: requestedHint.subMissionId,
        order: currentOrder - 1,
      }).lean();

      if (!predecessorHint) {
        return res.status(400).json({
          ok: false,
          message: 'Previous hint does not exist.',
        });
      }

      const predecessorUsed = await HintUsageMetric.exists({
        userId,
        hintId: predecessorHint._id,
        usedAt: { $ne: null },
      });

      if (!predecessorUsed) {
        return res.status(403).json({
          ok: false,
          message: 'Previous hint must be opened first.',
        });
      }
    }


    await HintUsageMetric.create({
      userId,
      hintId: id,
      usedAt: new Date(),
    });

    return res.json({ ok: true, data: requestedHint });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getNarrationHintsBySubMissionId,
  getNarrationHintsById,
};
