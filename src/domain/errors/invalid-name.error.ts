export class InvalidNameError extends Error {
  constructor() {
    super('Le nom doit contenir au moins deux caractères.');
    this.name = 'InvalidNameError';
  }
}
