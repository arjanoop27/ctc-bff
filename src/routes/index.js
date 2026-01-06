const express = require('express');

const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/admin', adminRoutes);

module.exports = router;
