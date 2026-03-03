export class AdminInvalidUpdatePayloadError extends Error {
  constructor() {
    super('At least one field must be provided for update');
    this.name = 'AdminInvalidUpdatePayloadError';
  }
}
