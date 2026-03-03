export class EventInPendingStatusError extends Error {
  constructor() {
    super('O evento primeiro deve ser aprovado pela administração.');
    this.name = 'EventInPendingStatusError';
  }
}
