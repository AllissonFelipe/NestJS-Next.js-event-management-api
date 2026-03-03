export class EventNotFoundError extends Error {
  constructor(eventId: string) {
    super(`Event ${eventId} não encontrado.`);
    this.name = 'EventNotFoundError';
  }
}
