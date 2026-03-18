export class AdminSubscriptionPlanNotFoundError extends Error {
  constructor() {
    super('Plano de inscrição não encontrado');
    this.name = 'AdminSubscriptionPlanNotFoundError';
  }
}
