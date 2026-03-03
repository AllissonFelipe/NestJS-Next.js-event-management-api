export class UserPersonIdNotFoundError extends Error {
  constructor() {
    super('Person Id of user not found');
    this.name = 'UserPersonIdNotFoundError';
  }
}
