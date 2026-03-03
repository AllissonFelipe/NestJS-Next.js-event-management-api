export class AdminNotFoundError extends Error {
  constructor() {
    super('Rota ADMIN - Admin não encontrado');
    this.name = 'AdminNotFoundError';
  }
}
