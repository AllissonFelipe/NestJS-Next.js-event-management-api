export class EventParticipantNotFoundError extends Error {
  constructor() {
    super(`Event participant não encontrado.`);
    this.name = 'EventParticipantNotFoundError';
  }
}
