import { EntityManager } from 'typeorm';
import { EventParticipantsDomainEntity } from './event-participants.domain-entity';
import { PersonDomainEntity } from 'src/modules/person/domain/person.domain-entity';
import { EventsDomainEntity } from 'src/modules/events/domain/events.domain-entity';

export const EVENT_PARTICIPANTS_REPOSITORY = Symbol(
  'EVENTS_PARTICIPANTS_REPOSITORY',
);

export interface EventParticipantsRepositoryInterface {
  persist(
    domainEntity: EventParticipantsDomainEntity,
    manager?: EntityManager,
  ): Promise<EventParticipantsDomainEntity>;
  findWithPersonIdAndEventId(
    person: PersonDomainEntity,
    event: EventsDomainEntity,
    manager?: EntityManager,
  ): Promise<EventParticipantsDomainEntity | null>;
  deleteParticipationOfUser(
    eventParticipantsId: string,
    manager?: EntityManager,
  ): Promise<void>;
}
