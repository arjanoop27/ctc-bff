const { SubMission } = require('../models/SubMission');
const {getCompletedChallengeIdsByUser} = require("../services/progressMetricService");

async function getSubMissionsByMissionId(req, res, next) {
  try {
    const { id } = req.params;
    const subMissions = await SubMission.find({ missionId: id })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    const completedChallengeIds = await getCompletedChallengeIdsByUser(req.user.userId);
    const completedChallengeSet = new Set(completedChallengeIds);
    const data = subMissions.map((c) => ({
      ...c,
      status: completedChallengeSet.has(c.associatedChallengeId) ? 'completed' : 'active',
    }));
    return res.json({ ok: true, data: data });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getSubMissionsByMissionId,
};
