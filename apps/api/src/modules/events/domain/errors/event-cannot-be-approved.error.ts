export class EventCannotBeApprovedError extends Error {
  constructor() {
    super('Evento não pode ser aprovado.');
    this.name = 'EventCannotBeApprovedError';
  }
}
