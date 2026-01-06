const { createApp } = require('./app');
const { env } = require('./config/env');
const { connectDb } = require('./config/db');

async function start() {
  await connectDb(env.MONGODB_URI);

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`ctc-bff listening on http://localhost:${env.PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
