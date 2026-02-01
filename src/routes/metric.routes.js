const express = require('express');

const authMiddleware = require('../middleware/auth');
const {
  completeChallenge,
  startChallenge,
} = require('../controllers/metric.controller');

const router = express.Router();

router.post('/challenge/solved', authMiddleware, completeChallenge);

router.post('/challenge/:id', authMiddleware, startChallenge);

module.exports = router;
