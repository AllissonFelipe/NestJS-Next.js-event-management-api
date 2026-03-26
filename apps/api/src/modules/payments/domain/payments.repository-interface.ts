import { EntityManager } from 'typeorm';
import { PaymentsDomainEntity } from './payments.domain-entity';

export const PAYMENTS_REPOSITORY = Symbol('PAYMENTS_REPOSITORY');

export interface PaymentsRepositoryInterface {
  persist(payment: PaymentsDomainEntity, manager?: EntityManager): Promise<PaymentsDomainEntity | null>;
  findBySubscriptionId(subscriptionId: string, manager?: EntityManager): Promise<PaymentsDomainEntity | null>;
}
