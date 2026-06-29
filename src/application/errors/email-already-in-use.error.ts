export class EmailAlreadyInUseError extends Error {
  constructor() {
    super('Un compte utilise déjà cette adresse e-mail.');
    this.name = 'EmailAlreadyInUseError';
  }
}
