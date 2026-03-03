export class PersonIdNotFoundError extends Error {
  constructor(personId?: string) {
    super(`personId: ${personId} não encontrado`);
    this.name = 'PersonIdNotFoundError';
  }
}
