import { PersonMapper } from 'src/modules/person/infra/person.mapper';
import { SubscriptionPlansDomainEntity } from '../domain/subscription-plans.domain-entity';
import { SubscriptionPlansOrmEntity } from './subscription-plans.orm-entity';
import { SubscriptionMapper } from 'src/modules/subscription/infra/subscription.mapper';

export class SubscriptionPlansMapper {
  static toOrm(domain: SubscriptionPlansDomainEntity): SubscriptionPlansOrmEntity {
    const orm = new SubscriptionPlansOrmEntity();

    orm.id = domain.id;
    orm.name = domain.name;
    orm.description = domain.description;
    orm.price = domain.price;
    orm.duration_in_days = domain.durationInDays;
    orm.is_active = domain.isActive;
    orm.created_by = PersonMapper.toOrm(domain.createdBy);
    orm.created_at = domain.createdAt;
    orm.updated_at = domain.updatedAt;

    return orm;
  }

  static toDomain(orm: SubscriptionPlansOrmEntity): SubscriptionPlansDomainEntity {
    return SubscriptionPlansDomainEntity.restore({
      id: orm.id,
      name: orm.name,
      description: orm.description,
      price: Number(orm.price), // ORM usa decimal -> converter para number
      durationInDays: orm.duration_in_days,
      isActive: orm.is_active,
      createdBy: PersonMapper.toDomain(orm.created_by),
      // TODO: Arrumar depois que criar subscription domain
      subscriptions: orm.subscriptions
        ? orm.subscriptions.map((sub) => SubscriptionMapper.toDomain(sub))
        : [],
      createdAt: orm.created_at,
      updatedAt: orm.updated_at,
    });
  }
}
