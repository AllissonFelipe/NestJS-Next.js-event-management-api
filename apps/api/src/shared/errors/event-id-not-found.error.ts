export class EventIdNotFoundError extends Error {
  constructor(eventId?: string) {
    super(`eventId ${eventId} não encontrado.`);
    this.name = 'EventIdNotFoundError';
  }
}
