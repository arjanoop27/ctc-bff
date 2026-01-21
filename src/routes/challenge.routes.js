const express = require('express');
const { z } = require('zod');

const authMiddleware = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const validate = require('../middleware/validate');
const {
  createChallenge,
  updateChallenge,
  getAllChallenges,
  deleteChallengeById,
} = require('../controllers/challenge.controller');

const router = express.Router();

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  difficulty: z.number().int().min(1).max(4),
  tags: z.array(z.string().min(1)).optional().default([]),
});

const updateSchema = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    difficulty: z.number().int().min(1).max(4).optional(),
    tags: z.array(z.string().min(1)).optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: 'At least one field must be provided',
  });

router.post(
  '/',
  authMiddleware,
  adminOnly,
  validate(createSchema),
  createChallenge,
);

router.put(
  '/:id',
  authMiddleware,
  adminOnly,
  validate(updateSchema),
  updateChallenge,
);

router.get('/', authMiddleware, getAllChallenges);

router.delete('/:id', authMiddleware, adminOnly, deleteChallengeById);

module.exports = router;
