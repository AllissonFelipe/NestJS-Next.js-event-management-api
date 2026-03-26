/* eslint-disable prettier/prettier */
import { EntityManager, Repository } from 'typeorm';
import { SubscriptionDomainEntity } from '../domain/subscription.domain-entity';
import { SubscriptionRepositoryInterface } from '../domain/subscription.repository-interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionOrmEntity } from './subscription.orm-entity';

@Injectable()
export class SubscriptionRepositoryTypeOrm implements SubscriptionRepositoryInterface {
  constructor(
    @InjectRepository(SubscriptionOrmEntity)
    private readonly subscriptionRepository: Repository<SubscriptionOrmEntity>
  ) {}

  private getRepository(manager?: EntityManager): Repository<SubscriptionOrmEntity> {
    return manager ? manager.getRepository(SubscriptionOrmEntity) : this.subscriptionRepository;
  }

  async findActiveByPersonId(personId: string, manager?: EntityManager): Promise<SubscriptionDomainEntity | null> {
    const repository = this.getRepository(manager);
    const subscription = await repository.findOne({
      where: { person: { id: personId } }
    });
    if (!subscription) return null;
    throw new Error('Method not implemented.');
  }
}
