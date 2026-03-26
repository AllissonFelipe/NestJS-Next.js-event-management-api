import { randomUUID } from 'crypto';
import { PersonDomainEntity } from 'src/modules/person/domain/person.domain-entity';
import { SubscriptionDomainEntity } from 'src/modules/subscription/domain/subscription.domain-entity';

export class SubscriptionPlansDomainEntity {
  private _id: string;
  private _name: string;
  private _description: string;
  private _price: number;
  private _durationInDays: number;
  private _isActive: boolean;
  private _createdBy: PersonDomainEntity;
  private _subscriptions: SubscriptionDomainEntity[];
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: {
    id: string;
    name: string;
    description: string;
    price: number;
    durationInDays: number;
    isActive?: boolean;
    createdBy: PersonDomainEntity;
    subscriptions?: SubscriptionDomainEntity[];
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._price = props.price;
    this._durationInDays = props.durationInDays;
    this._isActive = props.isActive ?? false;
    this._createdBy = props.createdBy;
    this._subscriptions = props.subscriptions ?? [];
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  static create(props: {
    id?: string;
    name: string;
    description: string;
    price: number;
    durationInDays: number;
    isActive?: boolean;
    createdBy: PersonDomainEntity;
  }) {
    return new SubscriptionPlansDomainEntity({
      ...props,
      isActive: props.isActive ?? true,
      id: props.id ?? randomUUID(),
      subscriptions: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  static restore(props: {
    id: string;
    name: string;
    description: string;
    price: number;
    durationInDays: number;
    isActive: boolean;
    createdBy: PersonDomainEntity;
    subscriptions: SubscriptionDomainEntity[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new SubscriptionPlansDomainEntity(props);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get price() {
    return this._price;
  }

  get durationInDays() {
    return this._durationInDays;
  }

  get isActive() {
    return this._isActive;
  }

  get createdBy() {
    return this._createdBy;
  }

  get subscriptions() {
    return this._subscriptions;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  activate() {
    this._isActive = true;
    this.touch();
  }

  deactivate() {
    this._isActive = false;
    this.touch();
  }

  update(props: { name?: string; description?: string; price?: number; durationInDays?: number }) {
    let updated = false;

    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('Nome não pode ser vazio');
      }

      if (this._name !== props.name) {
        this._name = props.name;
        updated = true;
      }
    }

    if (props.description !== undefined) {
      if (this._description !== props.description) {
        this._description = props.description;
        updated = true;
      }
    }

    if (props.price !== undefined) {
      if (props.price < 0) {
        throw new Error('Preço não pode ser negativo.');
      }

      if (props.price !== this._price) {
        this._price = props.price;
        updated = true;
      }
    }

    if (props.durationInDays !== undefined) {
      if (props.durationInDays <= 0) {
        throw new Error('Duração deve ser maior que zero.');
      }

      if (props.durationInDays !== this._durationInDays) {
        this._durationInDays = props.durationInDays;
        updated = true;
      }
    }

    if (updated) {
      this.touch();
    }
  }

  private touch() {
    this._updatedAt = new Date();
  }
}
