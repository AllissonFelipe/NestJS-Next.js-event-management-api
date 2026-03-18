export class AdminSubscriptionPlanAlreadyDeactivateError extends Error {
  constructor() {
    super('Plano de inscrição já está desativado.');
    this.name = 'AdminSubscriptionPlanAlreadyDeactivateError';
  }
}
