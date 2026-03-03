export class EventEndDateInPastError extends Error {
  constructor() {
    super('A data do fim do evento deve acabar no futuro');
    this.name = 'EventEndDateInPastError';
  }
}
