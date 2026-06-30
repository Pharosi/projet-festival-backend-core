import jwt, { type SignOptions } from 'jsonwebtoken';

import type {
  TokenGenerator,
  TokenPayload,
} from '../../application/ports/token-generator.js';

export class JwtTokenGenerator implements TokenGenerator {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string = '1h',
  ) {}

  async generate(payload: TokenPayload): Promise<string> {
    return jwt.sign({ role: payload.role }, this.secret, {
      algorithm: 'HS256',
      expiresIn: this.expiresIn as SignOptions['expiresIn'],
      issuer: 'festival-backend-core',
      subject: payload.userId,
    });
  }
}
