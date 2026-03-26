import { PersonDomainEntity } from 'src/modules/person/domain/person.domain-entity';
import { SubscriptionPlansDomainEntity } from 'src/modules/subscription-plans/domain/subscription-plans.domain-entity';
import { SubscriptionStatusEnum } from './subscription-status.enum';
import { randomUUID } from 'crypto';

export class SubscriptionDomainEntity {
  private _id: string;
  private _person: PersonDomainEntity;
  private _subscriptionPlanId: string;
  private _startAt?: Date;
  private _endAt?: Date;
  private _status: SubscriptionStatusEnum;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: {
    id: string;
    person: PersonDomainEntity;
    subscriptionPlanId: string;
    startAt?: Date;
    endAt?: Date;
    status: SubscriptionStatusEnum;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = props.id;
    this._person = props.person;
    this._subscriptionPlanId = props.subscriptionPlanId;
    this._startAt = props.startAt;
    this._endAt = props.endAt;
    this._status = props.status;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get id(): string {
    return this._id;
  }

  get person(): PersonDomainEntity {
    return this._person;
  }

  get subscriptionPlanId(): string {
    return this._subscriptionPlanId;
  }

  get startAt(): Date | undefined {
    // if (!this._startAt) {
    //   throw new Error('Subscription ainda não foi ativada');
    // }
    return this._startAt;
  }

  get endAt(): Date | undefined {
    // if (!this._endAt) {
    //   throw new Error('Subscription ainda não foi ativada');
    // }
    return this._endAt;
  }

  get status(): SubscriptionStatusEnum {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  activate(durationInDays: number) {
    if (this._status === SubscriptionStatusEnum.ACTIVE) {
      throw new Error(`Usuário já é VIP.`);
    }

    const startAt = new Date();

    this._startAt = startAt;
    this._endAt = new Date(startAt.getTime() + durationInDays * 86400000);
    this._status = SubscriptionStatusEnum.ACTIVE;
    this._updatedAt = new Date();
  }

  isActive(): boolean {
    return this._status === SubscriptionStatusEnum.ACTIVE;
  }

  static create(props: {
    id?: string;
    person: PersonDomainEntity;
    subscriptionPlanId: SubscriptionPlansDomainEntity;
    status?: SubscriptionStatusEnum;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    return new SubscriptionDomainEntity({
      id: props.id ?? randomUUID(),
      person: props.person,
      subscriptionPlanId: props.subscriptionPlanId.id,
      status: props.status ?? SubscriptionStatusEnum.PENDING,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date()
    });
  }

  static restore(props: {
    id: string;
    person: PersonDomainEntity;
    subscriptionPlanId: string;
    startAt?: Date;
    endAt?: Date;
    status: SubscriptionStatusEnum;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new SubscriptionDomainEntity(props);
  }
}
