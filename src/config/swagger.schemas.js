const { UserSwaggerSchema } = require('../models/User');
const { UserContextSwaggerSchema } = require('../models/userContext');
const { NarrativeConfigSwaggerSchema } = require('../models/narrativeConfig');

module.exports = {
  User: UserSwaggerSchema,
  UserContext: UserContextSwaggerSchema,
  NarrativeConfig: NarrativeConfigSwaggerSchema,
};
