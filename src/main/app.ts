import express from 'express';

import type { RegisterUserController } from '../interfaces/http/controllers/register-user.controller.js';
import { errorHandler } from '../interfaces/http/middlewares/error-handler.js';
import { healthRouter } from '../interfaces/http/routes/health.routes.js';
import { createUserRouter } from '../interfaces/http/routes/user.routes.js';

type AppDependencies = {
  registerUserController?: RegisterUserController;
};

export function createApp(dependencies: AppDependencies = {}) {
  const app = express();

  app.use(express.json());
  app.use('/health', healthRouter);

  if (dependencies.registerUserController) {
    app.use('/users', createUserRouter(dependencies.registerUserController));
  }

  app.use(errorHandler);

  return app;
}
