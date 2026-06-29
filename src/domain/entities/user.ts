import { randomUUID } from 'node:crypto';

import { InvalidEmailError } from '../errors/invalid-email.error.js';
import { InvalidNameError } from '../errors/invalid-name.error.js';

export enum UserRole {
  VISITOR = 'VISITOR',
  ORGANIZER = 'ORGANIZER',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
}

type CreateUserProps = {
  name: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
};

export class User {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: UserRole,
    public readonly createdAt: Date,
  ) {}

  static create(props: CreateUserProps): User {
    const name = props.name.trim();
    const email = props.email.trim().toLowerCase();

    if (name.length < 2) {
      throw new InvalidNameError();
    }

    if (!User.isEmailValid(email)) {
      throw new InvalidEmailError();
    }

    return new User(
      randomUUID(),
      name,
      email,
      props.passwordHash,
      props.role ?? UserRole.VISITOR,
      new Date(),
    );
  }

  private static isEmailValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
