export class EventNotFoundError extends Error {
  constructor() {
    super('Evento não encontrado');
    this.name = 'EventNotFoundError';
  }
}
