import type { NextFunction, Request, Response } from 'express';

import { InvalidCredentialsError } from '../../../application/errors/invalid-credentials.error.js';
import type { AuthenticateUser } from '../../../application/use-cases/authenticate-user.js';

export class AuthenticateUserController {
  constructor(private readonly authenticateUser: AuthenticateUser) {}

  async handle(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const { email, password } = request.body as Record<string, unknown>;

    if (typeof email !== 'string' || typeof password !== 'string') {
      response.status(400).json({
        message: "L'adresse e-mail et le mot de passe sont obligatoires.",
      });
      return;
    }

    try {
      const { accessToken, user } = await this.authenticateUser.execute({
        email,
        password,
      });

      response.status(200).json({
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        response.status(401).json({ message: error.message });
        return;
      }

      next(error);
    }
  }
}
