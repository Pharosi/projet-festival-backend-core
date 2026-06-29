import express from 'express';

import { healthRouter } from '../interfaces/http/routes/health.routes.js';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use('/health', healthRouter);

  return app;
}
