export class EventNotFoundError extends Error {
  constructor() {
    super('Rota ADMIN - Event não encontrado');
    this.name = 'EventNotFoundError';
  }
}
