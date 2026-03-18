const { ChallengeMetric } = require('../models/challengeMetric');

async function getCompletedChallengeIdsByUser(userId){
    return ChallengeMetric.distinct('challengeId', {
        userId,
        startedAt: {$ne: null},
        completedAt: {$ne: null},
    });
}

module.exports = {
    getCompletedChallengeIdsByUser,
};
