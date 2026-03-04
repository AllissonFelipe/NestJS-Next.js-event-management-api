export class EventParticipationNotFoundError extends Error {
  constructor() {
    super('Participação de evento não encontrado.');
    this.name = 'EventParticipationNotFoundError';
  }
}
