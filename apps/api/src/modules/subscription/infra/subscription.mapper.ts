import { PersonMapper } from 'src/modules/person/infra/person.mapper';
import { SubscriptionDomainEntity } from '../domain/subscription.domain-entity';
import { SubscriptionOrmEntity } from './subscription.orm-entity';

export class SubscriptionMapper {
  static toOrm(domain: SubscriptionDomainEntity): SubscriptionOrmEntity {
    const orm = new SubscriptionOrmEntity();

    orm.id = domain.id;
    orm.person = PersonMapper.toOrm(domain.person);
    orm.subscription_plan.id = domain.subscriptionPlanId;
    orm.start_at = domain.startAt;
    orm.end_at = domain.endAt;
    orm.status = domain.status;
    orm.created_at = domain.createdAt;
    orm.updated_at = domain.updatedAt;

    return orm;
  }

  static toDomain(orm: SubscriptionOrmEntity): SubscriptionDomainEntity {
    return SubscriptionDomainEntity.restore({
      id: orm.id,
      person: PersonMapper.toDomain(orm.person),
      subscriptionPlanId: orm.subscription_plan.id,
      startAt: orm.start_at,
      endAt: orm.end_at,
      status: orm.status,
      createdAt: orm.created_at,
      updatedAt: orm.updated_at
    });
  }
}
