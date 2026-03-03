export class EmptyUpdatePayloadError extends Error {
  constructor() {
    super('At least one valid field must be provided for update.');
    this.name = 'EmptyUpdatePayloadError';
  }
}
