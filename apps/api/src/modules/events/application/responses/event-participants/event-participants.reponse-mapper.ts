import { EventParticipantsDomainEntity } from 'src/modules/event-participants/domain/event-participants.domain-entity';
import { EventsDomainEntity } from 'src/modules/events/domain/events.domain-entity';
import { PersonDomainEntity } from 'src/modules/person/domain/person.domain-entity';
import { EventParticipantsResponseDto } from './event-participants.response-dto';

export class EventParticipantsResponseMapper {
  static toResponse(
    eventParticipant: EventParticipantsDomainEntity,
    event: EventsDomainEntity,
    person: PersonDomainEntity,
  ): EventParticipantsResponseDto {
    return {
      event: {
        id: event.id,
        title: event.title,
      },
      person: {
        id: person.id,
        fullName: person.fullName,
      },
      status: eventParticipant.status,
    };
  }
}
