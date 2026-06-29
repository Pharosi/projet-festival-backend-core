import type { User } from '../../domain/entities/user.js';
import type { UserRepository } from '../../domain/repositories/user.repository.js';

export class InMemoryUserRepository implements UserRepository {
  public readonly users: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}
