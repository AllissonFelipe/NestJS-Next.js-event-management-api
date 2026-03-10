export class EventIsAlreadyApprovedError extends Error {
  constructor() {
    super('Evento já foi aprovado.');
    this.name = 'EventIsAlreadyApprovedError';
  }
}
