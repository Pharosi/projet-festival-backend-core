import bcrypt from 'bcrypt';

import type { PasswordHasher } from '../../application/ports/password-hasher.js';

export class BcryptPasswordHasher implements PasswordHasher {
  private readonly saltRounds = 12;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }
}
