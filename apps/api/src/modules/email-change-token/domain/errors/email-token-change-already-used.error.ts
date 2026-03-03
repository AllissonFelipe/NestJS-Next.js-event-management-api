export class EmailChangeTokenAlreadyUsedError extends Error {
  constructor() {
    super('Email change token already used.');
    this.name = 'EmailChangeTokenAlreadyUsedError';
  }
}
