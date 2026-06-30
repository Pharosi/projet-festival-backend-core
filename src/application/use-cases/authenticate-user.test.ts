import { describe, expect, it } from 'vitest';

import { User } from '../../domain/entities/user.js';
import { InMemoryUserRepository } from '../../infrastructure/repositories/in-memory-user.repository.js';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.js';
import type { PasswordHasher } from '../ports/password-hasher.js';
import type {
  TokenGenerator,
  TokenPayload,
} from '../ports/token-generator.js';
import { AuthenticateUser } from './authenticate-user.js';

class FakePasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return `hashed:${password}`;
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    return passwordHash === `hashed:${password}`;
  }
}

class FakeTokenGenerator implements TokenGenerator {
  async generate(payload: TokenPayload): Promise<string> {
    return `token:${payload.userId}:${payload.role}`;
  }
}

async function createAuthenticateUser() {
  const userRepository = new InMemoryUserRepository();
  const passwordHasher = new FakePasswordHasher();
  const tokenGenerator = new FakeTokenGenerator();
  const authenticateUser = new AuthenticateUser(
    userRepository,
    passwordHasher,
    tokenGenerator,
  );
  const user = User.create({
    name: 'Raphael PAES',
    email: 'raphael@example.com',
    passwordHash: await passwordHasher.hash('secure-password'),
  });

  await userRepository.save(user);

  return { authenticateUser, user };
}

describe('AuthenticateUser', () => {
  it('authenticates a user with valid credentials', async () => {
    const { authenticateUser, user } = await createAuthenticateUser();

    const result = await authenticateUser.execute({
      email: 'RAPHAEL@EXAMPLE.COM',
      password: 'secure-password',
    });

    expect(result.user).toBe(user);
    expect(result.accessToken).toBe(`token:${user.id}:VISITOR`);
  });

  it('rejects an unknown email', async () => {
    const { authenticateUser } = await createAuthenticateUser();

    await expect(
      authenticateUser.execute({
        email: 'unknown@example.com',
        password: 'secure-password',
      }),
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it('rejects an incorrect password', async () => {
    const { authenticateUser } = await createAuthenticateUser();

    await expect(
      authenticateUser.execute({
        email: 'raphael@example.com',
        password: 'incorrect-password',
      }),
    ).rejects.toThrow(InvalidCredentialsError);
  });
});
