export class InvalidEventDateRangeError extends Error {
  constructor() {
    super('A Data do fim do evento deve ser maior que o início');
    this.name = 'InvalidEventDateRangeError';
  }
}
