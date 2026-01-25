const { SubMission } = require('../models/SubMission');

async function getSubMissionsByMissionId(req, res, next) {
  try {
    const { id } = req.params;
    const subMissions = await SubMission.find({ missionId: id })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return res.json({ ok: true, data: subMissions });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getSubMissionsByMissionId,
};
