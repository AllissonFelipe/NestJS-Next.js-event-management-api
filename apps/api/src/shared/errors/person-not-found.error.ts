export class PersonNotFoundError extends Error {
  constructor(personId?: string) {
    super(`Person ${personId} não encontrado.`);
    this.name = 'PersonNotFoundError';
  }
}
