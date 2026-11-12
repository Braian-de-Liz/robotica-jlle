import { buildApp } from './src/app/app.js';
import { env } from './src/lib/env.js';

async function start() {
  const app = buildApp();
  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    console.log(`API CJR Joinville rodando em http://${env.HOST}:${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
