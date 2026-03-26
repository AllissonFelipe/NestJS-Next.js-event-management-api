import { SubscriptionDomainEntity } from 'src/modules/subscription/domain/subscription.domain-entity';
import { ProvidersEnum } from './providers.enum';
import { PaymentMethodEnum } from './payments-method.enum';
import { PaymentsStatusEnum } from './payments-status.enum';
import { randomUUID } from 'crypto';

export class PaymentsDomainEntity {
  private _id: string;
  private _subscription: SubscriptionDomainEntity;
  private _provider: ProvidersEnum;
  private _externalSessionId?: string;
  private _externalPaymentId?: string;
  private _paymentUrl?: string;
  private _paymentMethod?: PaymentMethodEnum;
  private _amount: number;
  private _currency: string;
  private _status: PaymentsStatusEnum;
  private _paidAt?: Date;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: {
    id: string;
    subscription: SubscriptionDomainEntity;
    provider: ProvidersEnum;
    paymentMethod?: PaymentMethodEnum;
    amount: number;
    currency?: string;
    status: PaymentsStatusEnum;
    externalSessionId?: string;
    externalPaymentId?: string;
    paymentUrl?: string;
    paidAt?: Date;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = props.id;
    this._subscription = props.subscription;
    this._provider = props.provider;
    this._paymentMethod = props.paymentMethod;
    this._amount = props.amount;
    this._currency = props.currency ?? 'BRL';
    this._status = props.status;
    this._externalSessionId = props.externalSessionId;
    this._externalPaymentId = props.externalPaymentId;
    this._paymentUrl = props.paymentUrl;
    this._paidAt = props.paidAt;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get subscription(): SubscriptionDomainEntity {
    return this._subscription;
  }

  get provider(): ProvidersEnum {
    return this._provider;
  }

  get paymentMethod(): PaymentMethodEnum | undefined {
    return this._paymentMethod;
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  get status(): PaymentsStatusEnum {
    return this._status;
  }

  get externalSessionId(): string | undefined {
    return this._externalSessionId;
  }

  get externalPaymentId(): string | undefined {
    return this._externalPaymentId;
  }

  get paymentUrl(): string | undefined {
    return this._paymentUrl;
  }

  get paidAt(): Date | undefined {
    return this._paidAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Domain behavior
  markAsPaid(paidAt?: Date) {
    if (this._status === PaymentsStatusEnum.PAID) {
      throw new Error('Pagamento já está marcado como pago.');
    }
    this._status = PaymentsStatusEnum.PAID;
    this._paidAt = paidAt ?? new Date();
    this._updatedAt = new Date();
  }

  changeStatus(status: PaymentsStatusEnum) {
    this._status = status;
  }

  chageExternaPaymentId(externalPaymentId: string) {
    this._externalPaymentId = externalPaymentId;
  }

  // Factory method for creation
  static create(props: {
    subscription: SubscriptionDomainEntity;
    provider: ProvidersEnum;
    paymentMethod?: PaymentMethodEnum;
    amount: number;
    currency?: string;
    status?: PaymentsStatusEnum;
    externalSessionId?: string;
    externalPaymentId?: string;
    paymentUrl?: string;
  }): PaymentsDomainEntity {
    return new PaymentsDomainEntity({
      id: randomUUID(),
      subscription: props.subscription,
      provider: props.provider,
      paymentMethod: props.paymentMethod,
      amount: props.amount,
      currency: props.currency ?? 'BRL',
      status: props.status ?? PaymentsStatusEnum.PENDING,
      externalSessionId: props.externalSessionId,
      externalPaymentId: props.externalPaymentId,
      paymentUrl: props.paymentUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // Restore method for reconstructing existing payment
  static restore(props: {
    id: string;
    subscription: SubscriptionDomainEntity;
    provider: ProvidersEnum;
    paymentMethod?: PaymentMethodEnum;
    amount: number;
    currency: string;
    status: PaymentsStatusEnum;
    externalSessionId?: string;
    externalPaymentId?: string;
    paymentUrl?: string;
    paidAt?: Date;
    createdAt: Date;
    updatedAt: Date;
  }): PaymentsDomainEntity {
    return new PaymentsDomainEntity(props);
  }
}
