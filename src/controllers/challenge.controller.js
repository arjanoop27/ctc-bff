const { Challenge } = require('../models/Challenge');

async function createChallenge(req, res, next) {
  try {
    const doc = await Challenge.create({
      description: req.body.description,
    });
    return res.status(201).json({ ok: true, data: doc });
  } catch (err) {
    return next(err);
  }
}

async function updateChallengeDescription(req, res, next) {
  try {
    const { id } = req.params;

    const updated = await Challenge.findOneAndUpdate(
      { _id: id },
      { $set: { description: req.body.description } },
      { new: true },
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
  updateChallengeDescription,
  getAllChallenges,
  deleteChallengeById,
};
