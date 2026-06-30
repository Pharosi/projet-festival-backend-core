import { AuthenticateUser } from '../application/use-cases/authenticate-user.js';
import { RegisterUser } from '../application/use-cases/register-user.js';
import { prisma } from '../infrastructure/database/prisma-client.js';
import { PrismaUserRepository } from '../infrastructure/repositories/prisma-user.repository.js';
import { BcryptPasswordHasher } from '../infrastructure/security/bcrypt-password-hasher.js';
import { JwtTokenGenerator } from '../infrastructure/security/jwt-token-generator.js';
import { AuthenticateUserController } from '../interfaces/http/controllers/authenticate-user.controller.js';
import { RegisterUserController } from '../interfaces/http/controllers/register-user.controller.js';

export function createDependencies() {
  if (!process.env.JWT_SECRET) {
    throw new Error("La variable d'environnement JWT_SECRET est obligatoire.");
  }

  const userRepository = new PrismaUserRepository(prisma);
  const passwordHasher = new BcryptPasswordHasher();
  const tokenGenerator = new JwtTokenGenerator(
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN ?? '1h',
  );
  const registerUser = new RegisterUser(userRepository, passwordHasher);
  const authenticateUser = new AuthenticateUser(
    userRepository,
    passwordHasher,
    tokenGenerator,
  );
  const registerUserController = new RegisterUserController(registerUser);
  const authenticateUserController = new AuthenticateUserController(
    authenticateUser,
  );

  return { authenticateUserController, registerUserController };
}
