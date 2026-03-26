import { Injectable } from '@nestjs/common';
import { PaymentsRepositoryInterface } from '../domain/payments.repository-interface';
import { EntityManager, Repository } from 'typeorm';
import { PaymentsDomainEntity } from '../domain/payments.domain-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentsOrmEntity } from './payments.orm-entity';
import { PaymentsMapper } from './payments.mapper';

@Injectable()
export class PaymentsRepositoryTypeOrm implements PaymentsRepositoryInterface {
  constructor(
    @InjectRepository(PaymentsOrmEntity)
    private readonly paymentsRepository: Repository<PaymentsOrmEntity>
  ) {}

  private getRepository(manager?: EntityManager): Repository<PaymentsOrmEntity> {
    return manager ? manager.getRepository(PaymentsOrmEntity) : this.paymentsRepository;
  }

  async persist(payment: PaymentsDomainEntity, manager?: EntityManager): Promise<PaymentsDomainEntity | null> {
    const repository = this.getRepository(manager);
    const toOrm = PaymentsMapper.toOrm(payment);
    const result = await repository.save(toOrm);
    // const reload = await repository.findOne({
    //   where: { id: result.id },
    //   relations: ['subscription']
    // })
    // if (!reload) return null;
    return payment;
  }

  async findBySubscriptionId(subscriptionId: string, manager?: EntityManager): Promise<PaymentsDomainEntity | null> {
    const repository = this.getRepository(manager);
    const orm = await repository.findOne({
      where: { subscription: { id: subscriptionId } }
    });
    if (!orm) return null;
    return PaymentsMapper.toDomain(orm);
  }
}
