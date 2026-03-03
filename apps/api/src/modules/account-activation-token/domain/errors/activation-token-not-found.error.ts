export class ActivationTokenNotFoundError extends Error {
  constructor() {
    super('Token de ativação não encontrado');
    this.name = 'ActivationTokenNotFoundError';
  }
}
