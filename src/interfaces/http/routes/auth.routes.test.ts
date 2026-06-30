import request from 'supertest';
import { describe, expect, it } from 'vitest';

import type { PasswordHasher } from '../../../application/ports/password-hasher.js';
import type {
  TokenGenerator,
  TokenPayload,
} from '../../../application/ports/token-generator.js';
import { AuthenticateUser } from '../../../application/use-cases/authenticate-user.js';
import { RegisterUser } from '../../../application/use-cases/register-user.js';
import { InMemoryUserRepository } from '../../../infrastructure/repositories/in-memory-user.repository.js';
import { createApp } from '../../../main/app.js';
import { AuthenticateUserController } from '../controllers/authenticate-user.controller.js';

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

async function createTestApp() {
  const userRepository = new InMemoryUserRepository();
  const passwordHasher = new FakePasswordHasher();
  const registerUser = new RegisterUser(userRepository, passwordHasher);
  const authenticateUser = new AuthenticateUser(
    userRepository,
    passwordHasher,
    new FakeTokenGenerator(),
  );
  const authenticateUserController = new AuthenticateUserController(
    authenticateUser,
  );

  await registerUser.execute({
    name: 'Raphael PAES',
    email: 'raphael@example.com',
    password: 'secure-password',
  });

  return createApp({ authenticateUserController });
}

describe('POST /auth/login', () => {
  it('returns an access token for valid credentials', async () => {
    const response = await request(await createTestApp())
      .post('/auth/login')
      .send({
        email: 'raphael@example.com',
        password: 'secure-password',
      });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toContain('token:');
    expect(response.body.user).toMatchObject({
      name: 'Raphael PAES',
      email: 'raphael@example.com',
      role: 'VISITOR',
    });
    expect(response.body.user).not.toHaveProperty('password');
    expect(response.body.user).not.toHaveProperty('passwordHash');
  });

  it('returns 401 for an incorrect password', async () => {
    const response = await request(await createTestApp())
      .post('/auth/login')
      .send({
        email: 'raphael@example.com',
        password: 'incorrect-password',
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Adresse e-mail ou mot de passe incorrect.',
    });
  });

  it('returns the same 401 response for an unknown email', async () => {
    const response = await request(await createTestApp())
      .post('/auth/login')
      .send({
        email: 'unknown@example.com',
        password: 'secure-password',
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Adresse e-mail ou mot de passe incorrect.',
    });
  });

  it('returns 400 when a required field is missing', async () => {
    const response = await request(await createTestApp())
      .post('/auth/login')
      .send({ email: 'raphael@example.com' });

    expect(response.status).toBe(400);
  });
});
