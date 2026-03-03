export class CannotReuseSamePasswordError extends Error {
  constructor() {
    super('Nova senha não pode ser igual á anterior');
    this.name = 'CannotReuseSamePasswordError';
  }
}
