export class InvalidEventDateError extends Error {
  constructor() {
    super('Invalid event date range');
  }
}
