export class EmailChangeTokenExpiredError extends Error {
  constructor() {
    super('Email change token expired.');
    this.name = 'EmailChangeTokenExpiredError';
  }
}
