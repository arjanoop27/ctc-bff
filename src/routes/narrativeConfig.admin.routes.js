const express = require('express');
const { z } = require('zod');

const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const validate = require('../middleware/validate');

const { NarrativeConfig } = require('../models/NarrativeConfig');
const { Settings } = require('../models/Settings');
const { normalizeNarrativeConfig } = require('../services/narrativeNormalizer');

const router = express.Router();

const hintSchema = z.object({
  id: z.string().uuid().optional(),
  order: z.number().int().optional(),
  message: z.string().min(1),
});

const narrationSchema = z.object({
  id: z.string().uuid().optional(),
  narration: z.string().optional(),
  context: z.string().optional(),
  target: z.string().optional(),
  hints: z.array(hintSchema).optional(),
});

const missionSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().optional(),
  title: z.string().optional(),
  objective: z.string().optional(),
  tags: z.array(z.string()).optional(),
  narration: narrationSchema.optional(),
});

const missionThemeSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional(),
  tagline: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isAvailable: z.boolean().optional(),
  imgSrc: z.string().optional(),
  missions: z.array(missionSchema).optional(),
});

const narrativeConfigCreateSchema = z.object({
  name: z.string().optional(),
  missionThemes: z.array(missionThemeSchema).optional(),
});

const narrativeConfigUpdateSchema = z.object({
  name: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
  version: z.number().int().optional(),
  missionThemes: z.array(missionThemeSchema),
});

router.get('/narrative-configs', auth, adminOnly, async (req, res, next) => {
  try {
    const docs = await NarrativeConfig.find({}, { missionThemes: 0 })
      .sort({ updatedAt: -1 })
      .lean();

    return res.json({ ok: true, data: docs });
  } catch (err) {
    return next(err);
  }
});

router.get(
  '/narrative-configs/:id',
  auth,
  adminOnly,
  async (req, res, next) => {
    try {
      const doc = await NarrativeConfig.findById(req.params.id).lean();
      if (!doc) {
        return res
          .status(404)
          .json({ ok: false, error: 'NarrativeConfig not found' });
      }
      return res.json({ ok: true, data: doc });
    } catch (err) {
      return next(err);
    }
  },
);

router.post(
  '/narrative-configs',
  auth,
  adminOnly,
  validate(narrativeConfigCreateSchema),
  async (req, res, next) => {
    try {
      const created = await NarrativeConfig.create({
        name: req.body.name || '',
        status: 'draft',
        version: 1,
        updatedBy: req.user.userId,
        missionThemes: req.body.missionThemes || [],
      });

      return res.status(201).json({ ok: true, data: created });
    } catch (err) {
      return next(err);
    }
  },
);

router.put(
  '/narrative-configs/:id',
  auth,
  adminOnly,
  validate(narrativeConfigUpdateSchema),
  async (req, res, next) => {
    try {
      let normalized;
      try {
        normalized = normalizeNarrativeConfig(req.body);
      } catch (e) {
        return res.status(400).json({ ok: false, error: e.message });
      }
      const updated = await NarrativeConfig.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            name: req.body.name ?? '',
            status: req.body.status ?? 'draft',
            missionThemes: normalized.missionThemes,
            updatedBy: req.user.userId,
          },
          $inc: { version: 1 },
        },
        { new: true },
      ).lean();

      if (!updated) {
        return res
          .status(404)
          .json({ ok: false, error: 'NarrativeConfig not found' });
      }
      return res.json({ ok: true, data: updated });
    } catch (err) {
      return next(err);
    }
  },
);

router.post(
  '/narrative-configs/:id/apply',
  auth,
  adminOnly,
  async (req, res, next) => {
    try {
      const id = req.params.id;

      const exists = await NarrativeConfig.exists({ _id: id });
      if (!exists) {
        return res
          .status(404)
          .json({ ok: false, error: 'NarrativeConfig not found' });
      }

      const settings = await Settings.findOneAndUpdate(
        { _id: 'ctc-settings' },
        { $set: { activeNarrativeConfigId: id } },
        { new: true },
      ).lean();

      return res.json({ ok: true, data: settings });
    } catch (err) {
      return next(err);
    }
  },
);

router.post(
  '/narrative-configs/:id/fallback',
  auth,
  adminOnly,
  async (req, res, next) => {
    try {
      const id = req.params.id;

      const exists = await NarrativeConfig.exists({ _id: id });
      if (!exists) {
        return res
          .status(404)
          .json({ ok: false, error: 'NarrativeConfig not found' });
      }

      const settings = await Settings.findOneAndUpdate(
        { _id: 'ctc-settings' },
        { $set: { fallbackNarrativeConfigId: id } },
        { new: true },
      ).lean();

      return res.json({ ok: true, data: settings });
    } catch (err) {
      return next(err);
    }
  },
);

module.exports = router;
