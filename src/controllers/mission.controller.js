const { Settings } = require('../models/settings');
const { Mission } = require('../models/Mission');

async function getAllAvailableMission(req, res, next) {
  try {
    const setting = await Settings.findById('ctc-settings').lean();
    const activeCtcTheme = setting?.activeCtcTheme;
    const availableMissions = await Mission.find({ ctcThemeId: activeCtcTheme })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return res.json({ ok: true, data: availableMissions });
  } catch (err) {
    return next(err);
  }
}

async function getMissionById(req, res, next) {
  try {
    const { id } = req.params;
    const mission = await Mission.findById({ _id: id }).lean();
    return res.json({ ok: true, data: mission });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getAllAvailableMission,
  getMissionById,
};
