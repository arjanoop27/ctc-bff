const express = require('express');
const { z } = require('zod');

const authMiddleware = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const validate = require('../middleware/validate');

const { Settings } = require('../models/Settings');
const { CtcTheme } = require('../models/ctcTheme');

const router = express.Router();

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
const updateSettingsSchema = z.object({
  activeCtcTheme: z.string().optional(),
  assignmentStrategy: z.enum(['fixed', 'random', 'iterative']).optional(),
  fixedMode: z.enum(['vanilla', 'narrative']).optional(),
  iterativeModes: z.array(z.enum(['vanilla', 'narrative'])).optional(),
  resetIterativeIndex: z.boolean().optional(),
});

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

      if (body.activeCtcTheme) {
        const exists = await CtcTheme.exists({
          _id: body.activeCtcTheme,
        });
        if (!exists) {
          return res.status(400).json({
            ok: false,
            error: 'Theme does not exist',
          });
        }
      }

      const update = {};
      if (body.assignmentStrategy)
        update.assignmentStrategy = body.assignmentStrategy;
      if (body.fixedMode) update.fixedMode = body.fixedMode;
      if (body.iterativeModes) update.iterativeModes = body.iterativeModes;
      if (body.activeCtcTheme) update.activeCtcTheme = body.activeCtcTheme;
      if (
        body.resetIterativeIndex === true &&
        body.assignmentStrategy === 'iterative'
      ) {
        update.iterativeIndex = 0;
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
