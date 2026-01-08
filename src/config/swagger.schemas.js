const { UserSwaggerSchema } = require('../models/User');
const { UserContextSwaggerSchema } = require('../models/userContext');
const { ChallengeSwaggerSchema } = require('../models/challenge');
const { CtcThemeSwaggerSchema } = require('../models/ctcTheme');
const { MissionSwaggerSchema } = require('../models/Mission');
const { SubMissionSwaggerSchema } = require('../models/subMission');
const { NarrationSwaggerSchema } = require('../models/narration');
const { NarrationHintSwaggerSchema } = require('../models/narrationHint');

module.exports = {
  User: UserSwaggerSchema,
  UserContext: UserContextSwaggerSchema,
  Challenge: ChallengeSwaggerSchema,
  CtcTheme: CtcThemeSwaggerSchema,
  Mission: MissionSwaggerSchema,
  SubMission: SubMissionSwaggerSchema,
  Narration: NarrationSwaggerSchema,
  NarrationHint: NarrationHintSwaggerSchema,
};
