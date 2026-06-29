import { describe, expect, it } from 'vitest';

import { InvalidEmailError } from '../errors/invalid-email.error.js';
import { InvalidNameError } from '../errors/invalid-name.error.js';
import { User, UserRole } from './user.js';

describe('User', () => {
  it('creates a visitor and normalizes their data', () => {
    const user = User.create({
      name: '  Camille Dupont  ',
      email: '  CAMILLE@EXAMPLE.COM  ',
      passwordHash: 'hashed-password',
    });

    expect(user.name).toBe('Camille Dupont');
    expect(user.email).toBe('camille@example.com');
    expect(user.role).toBe(UserRole.VISITOR);
  });

  it('rejects an invalid email', () => {
    expect(() =>
      User.create({
        name: 'Camille Dupont',
        email: 'invalid-email',
        passwordHash: 'hashed-password',
      }),
    ).toThrow(InvalidEmailError);
  });

  it('rejects a name that is too short', () => {
    expect(() =>
      User.create({
        name: 'C',
        email: 'camille@example.com',
        passwordHash: 'hashed-password',
      }),
    ).toThrow(InvalidNameError);
  });
});
