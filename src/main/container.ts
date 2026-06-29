import { RegisterUser } from '../application/use-cases/register-user.js';
import { prisma } from '../infrastructure/database/prisma-client.js';
import { PrismaUserRepository } from '../infrastructure/repositories/prisma-user.repository.js';
import { BcryptPasswordHasher } from '../infrastructure/security/bcrypt-password-hasher.js';
import { RegisterUserController } from '../interfaces/http/controllers/register-user.controller.js';

export function createDependencies() {
  const userRepository = new PrismaUserRepository(prisma);
  const passwordHasher = new BcryptPasswordHasher();
  const registerUser = new RegisterUser(userRepository, passwordHasher);
  const registerUserController = new RegisterUserController(registerUser);

  return { registerUserController };
}
