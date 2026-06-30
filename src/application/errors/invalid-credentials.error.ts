export class InvalidCredentialsError extends Error {
  constructor() {
    super('Adresse e-mail ou mot de passe incorrect.');
    this.name = 'InvalidCredentialsError';
  }
}
