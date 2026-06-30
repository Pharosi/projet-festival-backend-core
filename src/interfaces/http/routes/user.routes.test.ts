import request from 'supertest';
import { describe, expect, it } from 'vitest';

import type { PasswordHasher } from '../../../application/ports/password-hasher.js';
import { RegisterUser } from '../../../application/use-cases/register-user.js';
import { InMemoryUserRepository } from '../../../infrastructure/repositories/in-memory-user.repository.js';
import { RegisterUserController } from '../controllers/register-user.controller.js';
import { createApp } from '../../../main/app.js';

class FakePasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return `hashed:${password}`;
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    return passwordHash === `hashed:${password}`;
  }
}

function createTestApp() {
  const userRepository = new InMemoryUserRepository();
  const passwordHasher = new FakePasswordHasher();
  const registerUser = new RegisterUser(userRepository, passwordHasher);
  const registerUserController = new RegisterUserController(registerUser);

  return createApp({ registerUserController });
}

describe('POST /users/register', () => {
  it('registers a new visitor without exposing the password hash', async () => {
    const response = await request(createTestApp())
      .post('/users/register')
      .send({
        name: 'Raphael PAES',
        email: 'raphael.paes@example.com',
        password: 'secure-password',
      });

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({
      name: 'Raphael PAES',
      email: 'raphael.paes@example.com',
      role: 'VISITOR',
    });
    expect(response.body.user).not.toHaveProperty('password');
    expect(response.body.user).not.toHaveProperty('passwordHash');
  });

  it('returns 409 when the email is already in use', async () => {
    const app = createTestApp();
    const input = {
      name: 'Raphael PAES',
      email: 'raphael.paes@example.com',
      password: 'secure-password',
    };

    await request(app).post('/users/register').send(input);
    const response = await request(app).post('/users/register').send(input);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      message: 'Un compte utilise déjà cette adresse e-mail.',
    });
  });

  it('returns 400 when a required field is missing', async () => {
    const response = await request(createTestApp())
      .post('/users/register')
      .send({ email: 'raphael.paes@example.com' });

    expect(response.status).toBe(400);
  });

  it('returns 400 when the user data is invalid', async () => {
    const response = await request(createTestApp())
      .post('/users/register')
      .send({
        name: 'C',
        email: 'invalid-email',
        password: 'short',
      });

    expect(response.status).toBe(400);
  });
});
