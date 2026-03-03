export class EmailChangeTokenNotFoundError extends Error {
  constructor() {
    super('Email change token not found.');
    this.name = 'EmailChangeTokenNotFoundError';
  }
}
