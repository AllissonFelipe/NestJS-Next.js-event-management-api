import { SubscriptionMapper } from 'src/modules/subscription/infra/subscription.mapper';
import { PaymentsDomainEntity } from '../domain/payments.domain-entity';
import { PaymentsOrmEntity } from './payments.orm-entity';

export class PaymentsMapper {
  static toOrm(domain: PaymentsDomainEntity): PaymentsOrmEntity {
    const orm = new PaymentsOrmEntity();

    orm.id = domain.id;
    orm.provider = domain.provider;
    orm.external_session_id = domain.externalSessionId;
    orm.external_payment_id = domain.externalPaymentId;
    orm.payment_url = domain.paymentUrl;
    orm.payment_method = domain.paymentMethod;
    orm.amount = domain.amount;
    orm.currency = domain.currency;
    orm.status = domain.status;
    orm.paid_at = domain.paidAt;
    orm.created_at = domain.createdAt;
    orm.updated_at = domain.updatedAt;

    return orm;
  }

  static toDomain(orm: PaymentsOrmEntity): PaymentsDomainEntity {
    return PaymentsDomainEntity.restore({
      id: orm.id,
      subscription: SubscriptionMapper.toDomain(orm.subscription),
      provider: orm.provider,
      paymentMethod: orm.payment_method,
      amount: Number(orm.amount), // importante por causa do decimal do TypeORM
      currency: orm.currency,
      status: orm.status,
      externalSessionId: orm.external_session_id,
      externalPaymentId: orm.external_payment_id,
      paymentUrl: orm.payment_url,
      paidAt: orm.paid_at,
      createdAt: orm.created_at,
      updatedAt: orm.updated_at
    });
  }
}
