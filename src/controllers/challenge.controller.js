const { Challenge } = require('../models/Challenge');

async function createChallenge(req, res, next) {
  try {
    const doc = await Challenge.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      difficulty: req.body.difficulty,
      tags: req.body.tags ?? [],
    });

    return res.status(201).json({ ok: true, data: doc });
  } catch (err) {
    return next(err);
  }
}

async function updateChallenge(req, res, next) {
  try {
    const { id } = req.params;

    // Only allow updating known fields
    const update = {};
    if (req.body.name !== undefined) update.name = req.body.name;
    if (req.body.description !== undefined)
      update.description = req.body.description;
    if (req.body.category !== undefined) update.category = req.body.category;
    if (req.body.difficulty !== undefined)
      update.difficulty = req.body.difficulty;
    if (req.body.tags !== undefined) update.tags = req.body.tags;

    const updated = await Challenge.findOneAndUpdate(
      { _id: id },
      { $set: update },
      { new: true, runValidators: true },
    ).lean();

    if (!updated) {
      return res.status(404).json({ ok: false, error: 'Challenge not found' });
    }

    return res.json({ ok: true, data: updated });
  } catch (err) {
    return next(err);
  }
}

async function getAllChallenges(req, res, next) {
  try {
    const docs = await Challenge.find({}).sort({ createdAt: 1 }).lean();

    return res.json({ ok: true, data: docs });
  } catch (err) {
    return next(err);
  }
}

async function deleteChallengeById(req, res, next) {
  try {
    const { id } = req.params;

    const deleted = await Challenge.findOneAndDelete({ _id: id }).lean();
    if (!deleted) {
      return res.status(404).json({ ok: false, error: 'Challenge not found' });
    }

    return res.json({ ok: true, data: { id } });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createChallenge,
  updateChallenge,
  getAllChallenges,
  deleteChallengeById,
};
