const express = require('express');
const { z } = require('zod');

const authMiddleware = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const validate = require('../middleware/validate');

const { Settings } = require('../models/Settings');
const { NarrativeConfig } = require('../models/NarrativeConfig');

const router = express.Router();

router.use('/', require('./narrativeConfig.admin.routes'));

router.get(
  '/mode-setting',
  authMiddleware,
  adminOnly,
  async (req, res, next) => {
    try {
      const settings = await Settings.findById('ctc-settings').lean();
      return res.json({ ok: true, data: settings });
    } catch (err) {
      return next(err);
    }
  },
);

// PUT update settings (strategy rules)
const updateSettingsSchema = z
  .object({
    assignmentStrategy: z.enum(['fixed', 'random', 'iterative']).optional(),
    fixedMode: z.enum(['vanilla', 'narrative']).optional(),
    iterativeModes: z.array(z.enum(['vanilla', 'narrative'])).optional(),
    resetIterativeIndex: z.boolean().optional(),
    activeNarrativeConfigId: z.string().uuid().optional(),
    fallbackNarrativeConfigId: z.string().uuid().optional(),
  })
  .strict();

router.put(
  '/mode-setting',
  authMiddleware,
  adminOnly,
  validate(updateSettingsSchema),
  async (req, res, next) => {
    try {
      const body = req.body;

      if (body.assignmentStrategy === 'fixed' && !body.fixedMode) {
        return res.status(400).json({
          ok: false,
          error: 'fixedMode is required when assignmentStrategy=fixed',
        });
      }

      if (body.assignmentStrategy === 'iterative') {
        const modes = body.iterativeModes || ['narrative', 'vanilla'];
        if (modes.length < 1) {
          return res.status(400).json({
            ok: false,
            error: 'iterativeModes must contain at least one mode',
          });
        }
      }

      if (body.activeNarrativeConfigId) {
        const exists = await NarrativeConfig.exists({
          _id: body.activeNarrativeConfigId,
        });
        if (!exists) {
          return res.status(400).json({
            ok: false,
            error: 'activeNarrativeConfigId does not exist',
          });
        }
      }

      if (body.fallbackNarrativeConfigId) {
        const exists = await NarrativeConfig.exists({
          _id: body.fallbackNarrativeConfigId,
        });
        if (!exists) {
          return res.status(400).json({
            ok: false,
            error: 'fallbackNarrativeConfigId does not exist',
          });
        }
      }

      const update = {};
      if (body.assignmentStrategy)
        update.assignmentStrategy = body.assignmentStrategy;
      if (body.fixedMode) update.fixedMode = body.fixedMode;
      if (body.iterativeModes) update.iterativeModes = body.iterativeModes;
      if (
        body.resetIterativeIndex === true &&
        body.assignmentStrategy === 'iterative'
      ) {
        update.iterativeIndex = 0;
      }
      if (body.activeNarrativeConfigId) {
        update.activeNarrativeConfigId = body.activeNarrativeConfigId;
      }
      if (body.fallbackNarrativeConfigId) {
        update.fallbackNarrativeConfigId = body.fallbackNarrativeConfigId;
      }

      const settings = await Settings.findOneAndUpdate(
        { _id: 'ctc-settings' },
        { $set: update },
        { new: true },
      ).lean();

      return res.json({ ok: true, data: settings });
    } catch (err) {
      return next(err);
    }
  },
);

module.exports = router;
