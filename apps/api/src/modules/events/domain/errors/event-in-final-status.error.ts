export class EventInFinalStatusError extends Error {
  constructor() {
    super('Evento não pode ser modificado pois está em status final.');
    this.name = 'EventInFinalStatusError';
  }
}
