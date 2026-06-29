export class WeakPasswordError extends Error {
  constructor() {
    super('Le mot de passe doit contenir au moins huit caractères.');
    this.name = 'WeakPasswordError';
  }
}
