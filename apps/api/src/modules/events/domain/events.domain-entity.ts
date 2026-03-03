import { PersonDomainEntity } from 'src/modules/person/domain/person.domain-entity';
import { EventsStatusEnum } from './events-status.enum';
import { randomUUID } from 'crypto';
import { InvalidEventDateError } from './errors/invalid-event-data.error';
import { EventEndDateInPastError } from './errors/event-end-date-in-past.error';
import { InvalidEventDateRangeError } from './errors/invalid-event-date-range-error';
import { EventsAddressDomainEntity } from '../events-addresses/domain/events-addresses.domain-entity';
import { EventStatusCannotBeChangedError } from './errors/event-status-cannot-be-changed-error';
import { EventParticipantsDomainEntity } from 'src/modules/event-participants/domain/event-participants.domain-entity';

export class EventsDomainEntity {
  private _id: string;
  private _title: string;
  private _description: string;
  private _startAt: Date;
  private _endAt: Date;
  private _createdBy: PersonDomainEntity;
  private _status: EventsStatusEnum;
  private _address: EventsAddressDomainEntity;
  private _participants: EventParticipantsDomainEntity[];
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: {
    id: string;
    title: string;
    description?: string;
    startAt: Date;
    endAt: Date;
    createdBy: PersonDomainEntity;
    status: EventsStatusEnum;
    address: EventsAddressDomainEntity;
    participants: EventParticipantsDomainEntity[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = props.id;
    this._title = props.title;
    this._description = props.description ?? '';
    this._startAt = props.startAt;
    this._endAt = props.endAt;
    this._createdBy = props.createdBy;
    this._status = props.status;
    this._address = props.address;
    this._participants = props.participants ?? [];
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  // ----------------------- GETTERS --------------------------
  get id(): string {
    return this._id;
  }
  get title(): string {
    return this._title;
  }
  get description(): string {
    return this._description;
  }
  get startAt(): Date {
    return this._startAt;
  }
  get endAt(): Date {
    return this._endAt;
  }
  get createdBy(): PersonDomainEntity {
    return this._createdBy;
  }
  get status(): EventsStatusEnum {
    return this._status;
  }
  get address(): EventsAddressDomainEntity {
    return this._address;
  }
  get participants(): EventParticipantsDomainEntity[] {
    return this._participants;
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
  updateTitle(title: string): void {
    this._title = title;
    this.touch();
  }

  updateDescription(description: string): void {
    this._description = description;
    this.touch();
  }

  private updateStartAt(startAt: Date): void {
    this._startAt = startAt;
    this.touch();
  }

  private updateEndAt(endAt: Date): void {
    this._endAt = endAt;
    this.touch();
  }

  updateSchedule(startAt: Date, endAt: Date): void {
    if (isNaN(startAt.getTime()) || isNaN(endAt.getTime())) {
      throw new InvalidEventDateError();
    }
    if (endAt <= new Date()) {
      throw new EventEndDateInPastError();
    }
    if (endAt <= startAt) {
      throw new Error('End date must be after start date');
    }
    this._startAt = startAt;
    this._endAt = endAt;
    this.touch();
  }

  updateStatus(status: EventsStatusEnum): void {
    if (this.isFinalStatus()) {
      throw new EventStatusCannotBeChangedError();
    }
    this._status = status;
    this.touch();
  }

  updateEvent(props: {
    title?: string;
    description?: string;
    startAt?: Date | string;
    endAt?: Date | string;
  }): void {
    // --- Filtrar strings vazias ---
    if (props.title !== undefined && props.title.trim() !== '') {
      this.updateTitle(props.title.trim());
    }
    if (props.description !== undefined && props.description.trim() !== '') {
      this.updateDescription(props.description.trim());
    }
    // --- Calcular datas ---
    const startAt = props.startAt ? new Date(props.startAt) : this.startAt;
    const endAt = props.endAt ? new Date(props.endAt) : this.endAt;
    // --- Garantir consistência de schedule ---
    if (startAt > endAt) {
      throw new Error('Start date cannot be after end date');
    }
    if (props.startAt !== undefined || props.endAt !== undefined) {
      this.updateSchedule(startAt, endAt);
    }
    this.touch();
  }

  updateAddress(props: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  }) {
    this._address.updateAddress(props);
    this.touch();
  }

  isFinalStatus(): boolean {
    return [EventsStatusEnum.CANCELLED, EventsStatusEnum.REJECTED].includes(
      this._status,
    );
  }
  isEventStatusPending(): boolean {
    return [EventsStatusEnum.PENDING].includes(this._status);
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
    title: string;
    description?: string;
    startAt: string;
    endAt: string;
    createdBy: PersonDomainEntity;
    address: EventsAddressDomainEntity;
    now?: Date;
  }): EventsDomainEntity {
    const now = props.now ?? new Date();

    const startAt = new Date(props.startAt);
    const endAt = new Date(props.endAt);

    if (isNaN(startAt.getTime()) || isNaN(endAt.getTime())) {
      throw new InvalidEventDateError();
    }
    if (endAt <= now) {
      throw new EventEndDateInPastError();
    }
    if (endAt <= startAt) {
      throw new InvalidEventDateRangeError();
    }
    return new EventsDomainEntity({
      id: props.id ?? randomUUID(),
      title: props.title,
      description: props.description,
      startAt: startAt,
      endAt: endAt,
      createdBy: props.createdBy,
      status: EventsStatusEnum.PENDING,
      address: props.address,
      participants: [],
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: {
    id: string;
    title: string;
    description?: string;
    startAt: Date;
    endAt: Date;
    createdBy: PersonDomainEntity;
    status: EventsStatusEnum;
    address: EventsAddressDomainEntity;
    participants: EventParticipantsDomainEntity[];
    createdAt: Date;
    updatedAt: Date;
  }): EventsDomainEntity {
    if (!props.address) {
      throw new Error('Evento não pode ser restaurado sem endereço');
    }

    return new EventsDomainEntity({
      id: props.id,
      title: props.title,
      description: props.description,
      startAt: props.startAt,
      endAt: props.endAt,
      createdBy: props.createdBy,
      status: props.status,
      address: props.address,
      participants: props.participants,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }
}
