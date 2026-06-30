import type { User } from '../../domain/entities/user.js';
import type { UserRepository } from '../../domain/repositories/user.repository.js';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.js';
import type { PasswordHasher } from '../ports/password-hasher.js';
import type { TokenGenerator } from '../ports/token-generator.js';

type AuthenticateUserInput = {
  email: string;
  password: string;
};

type AuthenticateUserOutput = {
  accessToken: string;
  user: User;
};

export class AuthenticateUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async execute(input: AuthenticateUserInput): Promise<AuthenticateUserOutput> {
    const email = input.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = await this.passwordHasher.compare(
      input.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    const accessToken = await this.tokenGenerator.generate({
      userId: user.id,
      role: user.role,
    });

    return { accessToken, user };
  }
}
