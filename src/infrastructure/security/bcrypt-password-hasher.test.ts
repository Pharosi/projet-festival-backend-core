import { describe, expect, it } from 'vitest';

import { BcryptPasswordHasher } from './bcrypt-password-hasher.js';

describe('BcryptPasswordHasher', () => {
  it('creates a bcrypt hash that matches the password', async () => {
    const passwordHasher = new BcryptPasswordHasher();
    const password = 'secure-password';

    const hash = await passwordHasher.hash(password);

    expect(hash).not.toBe(password);
    await expect(passwordHasher.compare(password, hash)).resolves.toBe(true);
    await expect(
      passwordHasher.compare('incorrect-password', hash),
    ).resolves.toBe(false);
  });
});
