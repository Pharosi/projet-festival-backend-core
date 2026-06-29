export class InvalidEmailError extends Error {
  constructor() {
    super("L'adresse e-mail n'est pas valide.");
    this.name = 'InvalidEmailError';
  }
}
