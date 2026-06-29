import type { NextFunction, Request, Response } from 'express';

import { EmailAlreadyInUseError } from '../../../application/errors/email-already-in-use.error.js';
import { WeakPasswordError } from '../../../application/errors/weak-password.error.js';
import type { RegisterUser } from '../../../application/use-cases/register-user.js';
import { InvalidEmailError } from '../../../domain/errors/invalid-email.error.js';
import { InvalidNameError } from '../../../domain/errors/invalid-name.error.js';

export class RegisterUserController {
  constructor(private readonly registerUser: RegisterUser) {}

  async handle(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const { name, email, password } = request.body as Record<string, unknown>;

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      response.status(400).json({
        message: "Le nom, l'adresse e-mail et le mot de passe sont obligatoires.",
      });
      return;
    }

    try {
      const user = await this.registerUser.execute({ name, email, password });

      response.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      if (
        error instanceof WeakPasswordError ||
        error instanceof InvalidEmailError ||
        error instanceof InvalidNameError
      ) {
        response.status(400).json({ message: error.message });
        return;
      }

      if (error instanceof EmailAlreadyInUseError) {
        response.status(409).json({ message: error.message });
        return;
      }

      next(error);
    }
  }
}
