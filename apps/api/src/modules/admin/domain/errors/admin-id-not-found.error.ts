export class AdminIdNotFoundError extends Error {
  constructor() {
    super('Rota ADMIN - Id de admin não encontrado');
    this.name = 'AdminIdNotFoundError';
  }
}
