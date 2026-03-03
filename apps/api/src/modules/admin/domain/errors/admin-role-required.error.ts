export class AdminRoleRequiredError extends Error {
  constructor() {
    super('Rota ADMIN - Role de admin é requirido');
    this.name = 'AdminRoleRequiredError';
  }
}
