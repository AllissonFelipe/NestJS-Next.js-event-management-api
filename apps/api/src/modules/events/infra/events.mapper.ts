import { EventsOrmEntity } from '../infra/events.orm-entity';
import { EventsDomainEntity } from '../domain/events.domain-entity';
import { PersonMapper } from 'src/modules/person/infra/person.mapper';
import { EventsAddressMapper } from '../events-addresses/infra/events-addresses.mapper';
import { EventParticipantMapper } from 'src/modules/event-participants/infra/event-participants.mapper';

export class EventsMapper {
  static toDomain(entity: EventsOrmEntity): EventsDomainEntity {
    const eventDomain = EventsDomainEntity.restore({
      id: entity.id,
      title: entity.title,
      description: entity.description,
      startAt: entity.start_at,
      endAt: entity.end_at,
      createdBy: PersonMapper.toDomain(entity.created_by),
      status: entity.status,
      address: EventsAddressMapper.toDomain(entity.event_address),
      participants: [],
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
    });
    if (entity.participants?.length) {
      const participants = entity.participants.map((p) =>
        EventParticipantMapper.toDomain(p, eventDomain),
      );
      // atualiza a lista de participantes de forma segura
      eventDomain['_participants'] = participants; // assume que você tem um private readonly _participants com getter
    }
    return eventDomain;
  }

  static toOrm(domain: EventsDomainEntity): EventsOrmEntity {
    const orm = new EventsOrmEntity();

    orm.id = domain.id;
    orm.title = domain.title;
    orm.description = domain.description;
    orm.start_at = domain.startAt;
    orm.end_at = domain.endAt;
    orm.created_by = PersonMapper.toOrm(domain.createdBy);
    orm.status = domain.status;
    orm.event_address = EventsAddressMapper.toOrm(domain.address);
    orm.created_at = domain.createdAt;
    orm.updated_at = domain.updatedAt;

    return orm;
  }
}
