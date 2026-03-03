export class PersonRoleNotAllowedError extends Error {
  constructor(role?: string) {
    super(`A role '${role}' não possui permissão para executar esta ação.`);
    this.name = 'PersonRoleNotAllowedError';
  }
}
