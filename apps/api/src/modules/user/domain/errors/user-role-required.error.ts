export class UserRoleRequiredError extends Error {
  constructor() {
    super('User does not have the required USER role.');
    this.name = 'UserRoleRequiredError';
  }
}
