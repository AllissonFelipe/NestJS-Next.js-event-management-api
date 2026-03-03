export class EventAddressNotFoundError extends Error {
  constructor(eventId: string) {
    super(`Endereço do evento ${eventId} não encontrado.`);
    this.name = 'EventAddressNotFoundError';
  }
}
