import { randomUUID } from 'crypto';

export class EventsAddressDomainEntity {
  private _id: string;
  private _street: string;
  private _number: string;
  private _complement?: string;
  private _neighborhood: string;
  private _city: string;
  private _state: string;
  private _zipCode: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: {
    id: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = props.id;
    this._street = props.street;
    this._number = props.number;
    this._complement = props.complement;
    this._neighborhood = props.neighborhood;
    this._city = props.city;
    this._state = props.state;
    this._zipCode = props.zipCode;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  // ----------------------- GETTERS --------------------------
  get id(): string {
    return this._id;
  }

  get street(): string {
    return this._street;
  }

  get number(): string {
    return this._number;
  }

  get complement(): string | undefined {
    return this._complement;
  }

  get neighborhood(): string {
    return this._neighborhood;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get zipCode(): string {
    return this._zipCode;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /* =======================
   * UPDATE METHODS
   * ======================= */
  updateAddress(props: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  }) {
    let changed = false;

    if (props.number !== undefined && props.number.trim() !== '') {
      this._number = props.number;
      changed = true;
    }

    if (props.street !== undefined && props.street.trim() !== '') {
      this._street = props.street;
      changed = true;
    }

    if (props.complement !== undefined) {
      this._complement = props.complement;
      changed = true;
    }

    if (props.neighborhood !== undefined && props.neighborhood.trim() !== '') {
      this._neighborhood = props.neighborhood;
      changed = true;
    }

    if (props.city !== undefined && props.city.trim() !== '') {
      this._city = props.city;
      changed = true;
    }

    if (props.state !== undefined && props.state.trim() !== '') {
      this._state = props.state;
      changed = true;
    }

    if (props.zipCode !== undefined && props.zipCode.trim() !== '') {
      this._zipCode = props.zipCode;
      changed = true;
    }

    if (changed) {
      this.touch();
    }
  }

  /* =======================
   * INTERNALS
   * ======================= */
  private touch(): void {
    this._updatedAt = new Date();
  }

  /* =======================
   * FACTORIES
   * ======================= */
  static create(props: {
    id?: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  }): EventsAddressDomainEntity {
    const now = new Date();
    return new EventsAddressDomainEntity({
      id: props.id || randomUUID(),
      street: props.street,
      number: props.number,
      complement: props.complement,
      neighborhood: props.neighborhood,
      city: props.city,
      state: props.state,
      zipCode: props.zipCode,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: {
    id: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    createdAt: Date;
    updatedAt: Date;
  }): EventsAddressDomainEntity {
    return new EventsAddressDomainEntity({
      id: props.id,
      street: props.street,
      number: props.number,
      complement: props.complement,
      neighborhood: props.neighborhood,
      city: props.city,
      state: props.state,
      zipCode: props.zipCode,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }
}
