import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionPlansOrmEntity } from './subscription-plans.orm-entity';
import { EntityManager, Repository } from 'typeorm';
import { SubscriptionPlansRepositoryInterface } from '../domain/subscription-plans.repository-interface';
import { SubscriptionPlansDomainEntity } from '../domain/subscription-plans.domain-entity';
import { SubscriptionPlansMapper } from './subscription-plans.mapper';
import { SubscriptionMapper } from 'src/modules/subscription/infra/subscription.mapper';

@Injectable()
export class SubscriptionPlansRepositoryTypeOrm implements SubscriptionPlansRepositoryInterface {
  constructor(
    @InjectRepository(SubscriptionPlansOrmEntity)
    private readonly subscriptionPlanRepository: Repository<SubscriptionPlansOrmEntity>,
  ) {}

  private getRepository(manager?: EntityManager): Repository<SubscriptionPlansOrmEntity> {
    return manager
      ? manager.getRepository(SubscriptionPlansOrmEntity)
      : this.subscriptionPlanRepository;
  }

  async persist(
    domainEntity: SubscriptionPlansDomainEntity,
    manager?: EntityManager,
  ): Promise<SubscriptionPlansDomainEntity> {
    const repository = this.getRepository(manager);
    const ormEntity = SubscriptionPlansMapper.toOrm(domainEntity);
    const saved = await repository.save(ormEntity);
    return SubscriptionPlansMapper.toDomain(saved);
  }

  async findAll(manager?: EntityManager): Promise<SubscriptionPlansDomainEntity[]> {
    const repository = this.getRepository(manager);
    const ormEntities = await repository.find({
      relations: ['created_by', 'created_by.person_role', 'created_by.person_profile'],
    });
    return ormEntities.map((entity) => SubscriptionPlansMapper.toDomain(entity));
  }

  async findOne(
    subscriptionPlanId: string,
    manager?: EntityManager,
  ): Promise<SubscriptionPlansDomainEntity | null> {
    const repository = this.getRepository(manager);
    const ormEntity = await repository.findOne({
      where: { id: subscriptionPlanId },
      relations: ['created_by', 'created_by.person_role', 'created_by.person_profile'],
    });
    if (!ormEntity) return null;
    return SubscriptionPlansMapper.toDomain(ormEntity);
  }

  async delete(subscriptionPlanId: string, manager?: EntityManager): Promise<void> {
    const repository = this.getRepository(manager);
    await repository.delete(subscriptionPlanId);
  }
}
