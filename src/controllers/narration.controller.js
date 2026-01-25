const { Narration } = require('../models/narration');

async function getNarrationBySubMissionId(req, res, next) {
  try {
    const { id } = req.params;
    const subMissionDetails = await Narration.findOne({
      subMissionId: id,
    }).lean();
    return res.json({ ok: true, data: subMissionDetails });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getNarrationBySubMissionId,
};
