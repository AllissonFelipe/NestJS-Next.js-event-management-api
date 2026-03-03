export class EventStatusCannotBeChangedError extends Error {
  constructor() {
    super('Event status cannot be changed');
    this.name = 'EventStatusCannotBeChangedError';
  }
}
