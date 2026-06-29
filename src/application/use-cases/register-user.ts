import { User } from '../../domain/entities/user.js';
import type { UserRepository } from '../../domain/repositories/user.repository.js';
import { EmailAlreadyInUseError } from '../errors/email-already-in-use.error.js';
import { WeakPasswordError } from '../errors/weak-password.error.js';
import type { PasswordHasher } from '../ports/password-hasher.js';

type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
};

export class RegisterUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const email = input.email.trim().toLowerCase();
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new EmailAlreadyInUseError();
    }

    if (input.password.length < 8) {
      throw new WeakPasswordError();
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = User.create({
      name: input.name,
      email,
      passwordHash,
    });

    await this.userRepository.save(user);

    return user;
  }
}
