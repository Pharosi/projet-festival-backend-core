import { Router } from 'express';

import type { RegisterUserController } from '../controllers/register-user.controller.js';

export function createUserRouter(controller: RegisterUserController): Router {
  const userRouter = Router();

  userRouter.post('/register', (request, response, next) => {
    void controller.handle(request, response, next);
  });

  return userRouter;
}
