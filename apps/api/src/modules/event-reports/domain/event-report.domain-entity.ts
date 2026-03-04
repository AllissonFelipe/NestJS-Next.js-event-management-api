import { EventsDomainEntity } from 'src/modules/events/domain/events.domain-entity';
import { PersonDomainEntity } from 'src/modules/person/domain/person.domain-entity';
import { EventReportStatusEnum } from './event-report-status.enum';
import { randomUUID } from 'crypto';

export class EventReportDomainEntity {
  private _id: string;
  private _event: EventsDomainEntity;
  private _reporter: PersonDomainEntity;
  private _reason: string;
  private _status: EventReportStatusEnum;
  private _createdAt: Date;

  private constructor(props: {
    id: string;
    event: EventsDomainEntity;
    reporter: PersonDomainEntity;
    reason: string;
    status: EventReportStatusEnum;
    createdAt: Date;
  }) {
    this._id = props.id;
    this._event = props.event;
    this._reporter = props.reporter;
    this._reason = props.reason;
    this._status = props.status;
    this._createdAt = props.createdAt;
  }

  get id(): string {
    return this._id;
  }
  get event(): EventsDomainEntity {
    return this._event;
  }
  get reporter(): PersonDomainEntity {
    return this._reporter;
  }
  get reason(): string {
    return this._reason;
  }
  get status(): EventReportStatusEnum {
    return this._status;
  }
  get createdAt(): Date {
    return this._createdAt;
  }

  static create(props: {
    id?: string;
    event: EventsDomainEntity;
    reporter: PersonDomainEntity;
    reason: string;
    status?: EventReportStatusEnum;
    createdAt?: Date;
  }) {
    return new EventReportDomainEntity({
      id: props.id ?? randomUUID(),
      ...props,
      status: props.status ?? EventReportStatusEnum.OPEN,
      createdAt: props.createdAt ?? new Date(),
    });
  }
  static restore(props: {
    id: string;
    event: EventsDomainEntity;
    reporter: PersonDomainEntity;
    reason: string;
    status: EventReportStatusEnum;
    createdAt: Date;
  }): EventReportDomainEntity {
    return new EventReportDomainEntity({
      id: props.id,
      event: props.event,
      reporter: props.reporter,
      reason: props.reason,
      status: props.status,
      createdAt: props.createdAt,
    });
  }
}
