const express = require('express');

const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');
const challengeRoutes = require('./challenge.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/admin', adminRoutes);
router.use('/api/challenges', challengeRoutes);

module.exports = router;
