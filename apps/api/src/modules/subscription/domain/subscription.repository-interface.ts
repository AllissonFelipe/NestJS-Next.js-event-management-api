import { EntityManager } from 'typeorm';
import { SubscriptionDomainEntity } from './subscription.domain-entity';

export const SUBSCRIPTION_REPOSITORY = Symbol('SUBSCRIPTION_REPOSITORY');

export interface SubscriptionRepositoryInterface {
  persist(subscription: SubscriptionDomainEntity, manager?: EntityManager): Promise<SubscriptionDomainEntity>;
  findActiveByPersonId(personId: string, manager?: EntityManager): Promise<SubscriptionDomainEntity | null>;
  findById(subscriptionId: string, manager?: EntityManager): Promise<SubscriptionDomainEntity | null>;
}
