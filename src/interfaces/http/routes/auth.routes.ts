import { Router } from 'express';

import type { AuthenticateUserController } from '../controllers/authenticate-user.controller.js';

export function createAuthRouter(
  controller: AuthenticateUserController,
): Router {
  const authRouter = Router();

  authRouter.post('/login', (request, response, next) => {
    void controller.handle(request, response, next);
  });

  return authRouter;
}
