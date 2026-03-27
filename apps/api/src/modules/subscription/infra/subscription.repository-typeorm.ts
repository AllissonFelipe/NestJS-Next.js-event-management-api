import { EntityManager, Repository } from 'typeorm';
import { SubscriptionDomainEntity } from '../domain/subscription.domain-entity';
import { SubscriptionRepositoryInterface } from '../domain/subscription.repository-interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionOrmEntity } from './subscription.orm-entity';
import { SubscriptionMapper } from './subscription.mapper';
import { SubscriptionStatusEnum } from '../domain/subscription-status.enum';

@Injectable()
export class SubscriptionRepositoryTypeOrm implements SubscriptionRepositoryInterface {
  constructor(
    @InjectRepository(SubscriptionOrmEntity)
    private readonly subscriptionRepository: Repository<SubscriptionOrmEntity>
  ) {}

  private getRepository(manager?: EntityManager): Repository<SubscriptionOrmEntity> {
    return manager ? manager.getRepository(SubscriptionOrmEntity) : this.subscriptionRepository;
  }

  async persist(subscription: SubscriptionDomainEntity, manager?: EntityManager): Promise<SubscriptionDomainEntity> {
    const repository = this.getRepository(manager);
    const orm = SubscriptionMapper.toOrm(subscription);
    const result = await repository.save(orm);
    return SubscriptionMapper.toDomain(result);
  }

  async findById(subscriptionId: string, manager?: EntityManager): Promise<SubscriptionDomainEntity | null> {
    const repository = this.getRepository(manager);
    const orm = await repository.findOne({
      where: { id: subscriptionId },
      relations: ['person', 'person.person_role', 'person.person_profile', 'subscription_plan']
    });
    if (!orm) return null;
    return SubscriptionMapper.toDomain(orm);
  }

  async findActiveByPersonId(personId: string, manager?: EntityManager): Promise<SubscriptionDomainEntity | null> {
    const repository = this.getRepository(manager);
    const subscription = await repository.findOne({
      where: { person: { id: personId }, status: SubscriptionStatusEnum.ACTIVE },
      relations: ['person', 'person.person_role', 'person.person_profile', 'subscription_plan']
    });
    if (!subscription) return null;
    return SubscriptionMapper.toDomain(subscription);
  }
}
