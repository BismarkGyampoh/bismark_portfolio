import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

app.listen(env.port, () => {
  console.log(`[server] Portfolio API listening on http://localhost:${env.port} (${env.nodeEnv})`);
  console.log(`[server] Health: http://localhost:${env.port}/api/v1/health`);
});
