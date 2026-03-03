export class EventAddressNotFoundError extends Error {
  constructor() {
    super('Endereço do evento não encontrado');
    this.name = 'EventAddressNotFoundError';
  }
}
