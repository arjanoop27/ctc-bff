const express = require('express');
const { z } = require('zod');

const authMiddleware = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const validate = require('../middleware/validate');
const {
  createChallenge,
  updateChallengeDescription,
  getAllChallenges,
  deleteChallengeById,
} = require('../controllers/challenge.controller');

const router = express.Router();

const createSchema = z.object({
  description: z.string().min(1),
});

const updateSchema = z.object({
  description: z.string().min(1),
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
  updateChallengeDescription,
);

router.get('/', authMiddleware, getAllChallenges);

router.delete('/:id', authMiddleware, adminOnly, deleteChallengeById);

module.exports = router;
