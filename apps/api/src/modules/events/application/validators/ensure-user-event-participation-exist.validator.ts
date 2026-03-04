import { Inject, Injectable } from '@nestjs/common';
import { EventParticipantsDomainEntity } from 'src/modules/event-participants/domain/event-participants.domain-entity';
import {
  EVENT_PARTICIPANTS_REPOSITORY,
  type EventParticipantsRepositoryInterface,
} from 'src/modules/event-participants/domain/event-participants.repository-interface';
import { EventParticipationNotFoundError } from '../../domain/errors/event-participation-not-found.error';
import { PersonDomainEntity } from 'src/modules/person/domain/person.domain-entity';
import { EventsDomainEntity } from '../../domain/events.domain-entity';

@Injectable()
export class EnsureUserEventParticipationExist {
  constructor(
    @Inject(EVENT_PARTICIPANTS_REPOSITORY)
    private readonly eventParticipantsRepository: EventParticipantsRepositoryInterface,
  ) {}

  async ensure(
    userPerson: PersonDomainEntity,
    event: EventsDomainEntity,
  ): Promise<EventParticipantsDomainEntity> {
    const eventParticipation =
      await this.eventParticipantsRepository.findWithPersonIdAndEventId(
        userPerson,
        event,
      );
    if (!eventParticipation) {
      throw new EventParticipationNotFoundError();
    }
    return eventParticipation;
  }
}
