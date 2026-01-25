const express = require('express');

const authMiddleware = require('../middleware/auth');
const {
  getAllAvailableMission,
  getMissionById,
} = require('../controllers/mission.controller');
const {
  getSubMissionsByMissionId,
} = require('../controllers/subMission.controller');
const {
  getNarrationBySubMissionId,
} = require('../controllers/narration.controller');
const {
  getNarrationHintsBySubMissionId,
  getNarrationHintsById,
} = require('../controllers/narrationHint.controller');

const router = express.Router();

router.get('/', authMiddleware, getAllAvailableMission);

router.get('/:id', authMiddleware, getMissionById);

router.get('/:id/sub-missions', authMiddleware, getSubMissionsByMissionId);

router.get(
  '/sub-mission/:id/details',
  authMiddleware,
  getNarrationBySubMissionId,
);

router.get(
  '/sub-mission/:id/hints',
  authMiddleware,
  getNarrationHintsBySubMissionId,
);

router.get('/sub-mission/hint/:id', authMiddleware, getNarrationHintsById);

module.exports = router;
