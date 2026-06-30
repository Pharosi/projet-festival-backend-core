import jwt from 'jsonwebtoken';
import { describe, expect, it } from 'vitest';

import { UserRole } from '../../domain/entities/user.js';
import { JwtTokenGenerator } from './jwt-token-generator.js';

describe('JwtTokenGenerator', () => {
  it('generates a signed token with the required claims', async () => {
    const secret = 'test-secret-with-at-least-thirty-two-characters';
    const tokenGenerator = new JwtTokenGenerator(secret, '1h');

    const token = await tokenGenerator.generate({
      userId: 'user-id',
      role: UserRole.VISITOR,
    });
    const payload = jwt.verify(token, secret, {
      algorithms: ['HS256'],
      issuer: 'festival-backend-core',
    });

    expect(payload).toMatchObject({
      sub: 'user-id',
      role: UserRole.VISITOR,
      iss: 'festival-backend-core',
    });
    expect(payload).toHaveProperty('iat');
    expect(payload).toHaveProperty('exp');
    expect(payload).not.toHaveProperty('email');
    expect(payload).not.toHaveProperty('passwordHash');
  });
});
