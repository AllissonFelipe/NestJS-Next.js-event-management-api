/* eslint-disable prettier/prettier */
export class ActivationTokenAlreadyUsedError extends Error {
    constructor() {
    super('Token já utilizado');
    this.name = 'ActivationTokenAlreadyUsedError';
  }
}