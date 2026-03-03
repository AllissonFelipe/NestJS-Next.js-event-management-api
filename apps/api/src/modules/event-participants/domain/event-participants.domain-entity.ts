import { EventsDomainEntity } from 'src/modules/events/domain/events.domain-entity';
import { EventParticipantStatusEnum } from './event-participants.status-enum';
import { randomUUID } from 'crypto';
import { PersonDomainEntity } from 'src/modules/person/domain/person.domain-entity';

export class EventParticipantsDomainEntity {
  private _id: string;
  private _event: EventsDomainEntity;
  private _person: PersonDomainEntity;
  private _status: EventParticipantStatusEnum;
  private _createdAt: Date;

  private constructor(props: {
    id: string;
    event: EventsDomainEntity;
    person: PersonDomainEntity;
    status: EventParticipantStatusEnum;
    createdAt: Date;
  }) {
    this._id = props.id;
    this._event = props.event;
    this._person = props.person;
    this._status = props.status;
    this._createdAt = props.createdAt;
  }

  get id(): string {
    return this._id;
  }
  get event(): EventsDomainEntity {
    return this._event;
  }
  get person(): PersonDomainEntity {
    return this._person;
  }
  get status(): EventParticipantStatusEnum {
    return this._status;
  }
  get createdAt(): Date {
    return this._createdAt;
  }

  updateStatus(status: EventParticipantStatusEnum) {
    if (this._status === status) {
      throw new Error(`Status atual já é igual ao pretendido`);
    }
    this._status = status;
  }
  markAsGoing() {
    this.updateStatus(EventParticipantStatusEnum.GOING);
  }
  markAsNotGoing() {
    this.updateStatus(EventParticipantStatusEnum.NOT_GOING);
  }
  markAsInterested() {
    this.updateStatus(EventParticipantStatusEnum.INTERESTED);
  }

  static create(props: {
    id?: string;
    event: EventsDomainEntity;
    person: PersonDomainEntity;
    status: EventParticipantStatusEnum;
    createdAt?: Date;
  }) {
    if (!Object.values(EventParticipantStatusEnum).includes(props.status)) {
      throw new Error(`Event partipants exige um status`);
    }
    const now = new Date();
    return new EventParticipantsDomainEntity({
      id: props.id ?? randomUUID(),
      event: props.event,
      person: props.person,
      status: props.status,
      createdAt: props.createdAt ?? now,
    });
  }

  static restore(props: {
    id: string;
    event: EventsDomainEntity;
    person: PersonDomainEntity;
    status: EventParticipantStatusEnum;
    createdAt: Date;
  }): EventParticipantsDomainEntity {
    if (!Object.values(EventParticipantStatusEnum).includes(props.status)) {
      throw new Error('Status inválido ao restaurar participante');
    }

    return new EventParticipantsDomainEntity({
      id: props.id,
      event: props.event,
      person: props.person,
      status: props.status,
      createdAt: props.createdAt,
    });
  }
}
