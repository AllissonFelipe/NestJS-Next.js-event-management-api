export class UserEventLimitReachedError extends Error {
  constructor() {
    super('Você já atingiu o limite de eventos que pode criar.');
    this.name = 'UserEventLimitReachedError';
  }
}
