const { createApp } = require('./app');
const { env } = require('./config/env');
const { connectDb } = require('./config/db');
const { bootstrap } = require('./config/bootstrap');
const {initSocket} = require("./config/socket");
const http = require("http");

async function start() {
  await connectDb(env.MONGODB_URI);
  await bootstrap();

  const app = createApp();
  const server = http.createServer(app);
  initSocket(server);

  server.listen(env.PORT, () => {
    console.log(`ctc-bff listening on http://localhost:${env.PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
