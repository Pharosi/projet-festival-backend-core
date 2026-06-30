import { describe, expect, it } from 'vitest';

import { UserRole } from '../../domain/entities/user.js';
import { InMemoryUserRepository } from '../../infrastructure/repositories/in-memory-user.repository.js';
import { EmailAlreadyInUseError } from '../errors/email-already-in-use.error.js';
import { WeakPasswordError } from '../errors/weak-password.error.js';
import type { PasswordHasher } from '../ports/password-hasher.js';
import { RegisterUser } from './register-user.js';

class FakePasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return `hashed:${password}`;
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    return passwordHash === `hashed:${password}`;
  }
}

function createRegisterUser() {
  const userRepository = new InMemoryUserRepository();
  const passwordHasher = new FakePasswordHasher();
  const registerUser = new RegisterUser(userRepository, passwordHasher);

  return { registerUser, userRepository };
}

describe('RegisterUser', () => {
  it('registers a visitor with a hashed password', async () => {
    const { registerUser, userRepository } = createRegisterUser();

    const user = await registerUser.execute({
      name: 'Raphael PAES',
      email: 'RAPHAEL.PAES@EXAMPLE.COM',
      password: 'secure-password',
    });

    expect(user.email).toBe('raphael.paes@example.com');
    expect(user.passwordHash).toBe('hashed:secure-password');
    expect(user.passwordHash).not.toBe('secure-password');
    expect(user.role).toBe(UserRole.VISITOR);
    expect(userRepository.users).toContain(user);
  });

  it('rejects an email that is already in use', async () => {
    const { registerUser } = createRegisterUser();
    const input = {
      name: 'Raphael PAES',
      email: 'raphael.paes@example.com',
      password: 'secure-password',
    };

    await registerUser.execute(input);

    await expect(registerUser.execute(input)).rejects.toThrow(
      EmailAlreadyInUseError,
    );
  });

  it('rejects a password shorter than eight characters', async () => {
    const { registerUser } = createRegisterUser();

    await expect(
      registerUser.execute({
        name: 'Raphael PAES',
        email: 'raphael.paes@example.com',
        password: 'short',
      }),
    ).rejects.toThrow(WeakPasswordError);
  });
});
