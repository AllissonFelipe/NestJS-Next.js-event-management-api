import { EventsMapper } from 'src/modules/events/infra/events.mapper';
import { EventReportDomainEntity } from '../domain/event-report.domain-entity';
import { EventReportOrmEntity } from './event-report.orm-entity';
import { PersonMapper } from 'src/modules/person/infra/person.mapper';

export class EventReportMapper {
  static toDomain(orm: EventReportOrmEntity): EventReportDomainEntity {
    return EventReportDomainEntity.restore({
      id: orm.id,
      event: EventsMapper.toDomain(orm.event),
      reporter: PersonMapper.toDomain(orm.reporter),
      reason: orm.reason,
      status: orm.status,
      createdAt: orm.created_at,
    });
  }

  static toOrm(domain: EventReportDomainEntity): EventReportOrmEntity {
    const orm = new EventReportOrmEntity();

    orm.id = domain.id;
    orm.event = EventsMapper.toOrm(domain.event);
    orm.reporter = PersonMapper.toOrm(domain.reporter);
    orm.reason = domain.reason;
    orm.status = domain.status;
    orm.created_at = domain.createdAt;

    return orm;
  }
}
