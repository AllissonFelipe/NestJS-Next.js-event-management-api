export class AdminSubscriptionPlanAlreadyActivateError extends Error {
  constructor() {
    super('Plano de inscrição já está ativado.');
    this.name = 'AdminSubscriptionPlanAlreadyActivateError';
  }
}
