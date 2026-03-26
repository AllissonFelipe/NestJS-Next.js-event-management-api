import { EntityManager } from 'typeorm';
import { SubscriptionDomainEntity } from './subscription.domain-entity';

export const SUBSCRIPTION_REPOSITORY = Symbol('SUBSCRIPTION_REPOSITORY');

export interface SubscriptionRepositoryInterface {
  findActiveByPersonId(personId: string, manager?: EntityManager): Promise<SubscriptionDomainEntity | null>;
}
