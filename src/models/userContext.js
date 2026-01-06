const mongoose = require('mongoose');

const userContextSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    ctcMode: {
      type: String,
      enum: ['vanilla', 'narrative'],
      default: 'vanilla',
      required: true,
    },
  },
  { timestamps: true },
);

const UserContext =
  mongoose.models.UserContext ||
  mongoose.model('UserContext', userContextSchema);

const UserContextSwaggerSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string', format: 'uuid', description: 'Same as User._id' },
    isAdmin: { type: 'boolean', example: false },
    ctcMode: {
      type: 'string',
      enum: ['vanilla', 'narrative'],
      example: 'vanilla',
    },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  required: ['_id', 'ctcMode'],
};

module.exports = { UserContext, UserContextSwaggerSchema };
