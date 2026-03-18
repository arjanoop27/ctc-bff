
const {Challenge} = require("../models/challenge");
const {getCompletedChallengeIdsByUser} = require("../services/progressMetricService");

async function getProgress(req, res, next) {
    try {
        const [total, completedChallengeIds] = await Promise.all([
            Challenge.countDocuments(),
            getCompletedChallengeIdsByUser(req.user.userId),
        ]);

        return res.json({
            ok: true,
            data: {
                total,
                completed: completedChallengeIds.length,
            },
        });
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    getProgress
};
