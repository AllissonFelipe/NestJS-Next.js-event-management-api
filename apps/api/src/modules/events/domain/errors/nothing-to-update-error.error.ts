export class NothingToUpdateError extends Error {
  constructor() {
    super('Não ha dados para atualizar o evento');
    this.name = 'NothingToUpdateError';
  }
}
