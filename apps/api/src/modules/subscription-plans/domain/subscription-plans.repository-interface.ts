import { EntityManager } from 'typeorm';
import { SubscriptionPlansDomainEntity } from './subscription-plans.domain-entity';

export const SUBSCRIPTION_PLANS_REPOSITORY = Symbol(
  'SUBSCRIPTION_PLANS_REPOSITORY',
);

export interface SubscriptionPlansRepositoryInterface {
  delete(subscriptionPlanId: string, manager?: EntityManager): Promise<void>;
  findOne(
    subscriptionPlanId: string,
    manager?: EntityManager,
  ): Promise<SubscriptionPlansDomainEntity | null>;
  persist(
    domainEntity: SubscriptionPlansDomainEntity,
    manager?: EntityManager,
  ): Promise<SubscriptionPlansDomainEntity>;
  findAll(manager?: EntityManager): Promise<SubscriptionPlansDomainEntity[]>;
}
