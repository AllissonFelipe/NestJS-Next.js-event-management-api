import { EntityManager } from 'typeorm';
import { SubscriptionDomainEntity } from '../domain/subscription.domain-entity';
import { SubscriptionRepositoryInterface } from '../domain/subscription.repository-interface';

export class SubscriptionRepositoryTypeOrm implements SubscriptionRepositoryInterface {
  findActiveByPersonId(
    personId: string,
    manager?: EntityManager,
  ): Promise<SubscriptionDomainEntity> {
    throw new Error('Method not implemented.');
  }
}
