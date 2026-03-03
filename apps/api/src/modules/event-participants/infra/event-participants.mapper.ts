import { EventParticipantsDomainEntity } from '../domain/event-participants.domain-entity';
import { EventParticipantsOrmEntity } from './event-participants.orm-entity';
import { EventsMapper } from 'src/modules/events/infra/events.mapper';
import { PersonMapper } from 'src/modules/person/infra/person.mapper';

import { EventsDomainEntity } from 'src/modules/events/domain/events.domain-entity';

export class EventParticipantMapper {
  static toDomain(
    ormEntity: EventParticipantsOrmEntity,
    eventDomain?: EventsDomainEntity,
  ): EventParticipantsDomainEntity {
    return EventParticipantsDomainEntity.restore({
      id: ormEntity.id,
      event: eventDomain ?? EventsMapper.toDomain(ormEntity.event),
      person: PersonMapper.toDomain(ormEntity.person),
      status: ormEntity.status,
      createdAt: ormEntity.created_at,
    });
  }

  static toOrm(
    domainEntity: EventParticipantsDomainEntity,
  ): EventParticipantsOrmEntity {
    const orm = new EventParticipantsOrmEntity();

    orm.id = domainEntity.id;
    orm.event = EventsMapper.toOrm(domainEntity.event);
    orm.person = PersonMapper.toOrm(domainEntity.person);
    orm.status = domainEntity.status;
    orm.created_at = domainEntity.createdAt;

    return orm;
  }
}
