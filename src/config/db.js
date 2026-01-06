const mongoose = require('mongoose');

async function connectDb(mongoUri) {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is missing');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    autoIndex: true,
  });

  console.log('MongoDB connected!');
}

module.exports = { connectDb };
