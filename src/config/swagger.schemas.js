const { UserSwaggerSchema } = require("../models/User");
const {UserContextSwaggerSchema} = require("../models/userContext");

module.exports = {
    User: UserSwaggerSchema,
    UserContext: UserContextSwaggerSchema
};
