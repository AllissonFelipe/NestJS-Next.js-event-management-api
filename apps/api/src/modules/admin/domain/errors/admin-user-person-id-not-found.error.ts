export class UserPersonIdNotFoundError extends Error {
  constructor() {
    super('Rota ADMIN - Usuário(PERSON) id não encontrado');
    this.name = 'UserPersonIdNotFoundError';
  }
}
