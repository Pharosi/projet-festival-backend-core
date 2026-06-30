import type { UserRole } from '../../domain/entities/user.js';

export type TokenPayload = {
  userId: string;
  role: UserRole;
};

export interface TokenGenerator {
  generate(payload: TokenPayload): Promise<string>;
}
