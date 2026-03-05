import { Inject, Injectable } from '@nestjs/common';
import { SetParticipationStatusDto } from '../../dto/set-participation-status.dto';
import { EnsurePersonExists } from '../../validators/ensure-person-exist.validator';
import { EnsureEventExists } from '../../validators/ensure-event-exist.validator';
import {
  EVENT_PARTICIPANTS_REPOSITORY,
  type EventParticipantsRepositoryInterface,
} from 'src/modules/event-participants/domain/event-participants.repository-interface';
import { EventParticipantsDomainEntity } from 'src/modules/event-participants/domain/event-participants.domain-entity';
import { EventParticipantsResponseMapper } from '../../responses/event-participants/event-participants.reponse-mapper';
import { EventParticipantsResponseDto } from '../../responses/event-participants/event-participants.response-dto';
import { EventsDomainEntity } from '../../../domain/events.domain-entity';
import { PersonDomainEntity } from 'src/modules/person/domain/person.domain-entity';
import { EventInFinalStatusError } from '../../../domain/errors/event-in-final-status.error';
import { EventInPendingStatusError } from '../../../domain/errors/event-in-pending-status.error';

@Injectable()
export class SetEventParticipationStatusUseCase {
  constructor(
    @Inject()
    private readonly ensurePersonExists: EnsurePersonExists,
    @Inject()
    private readonly ensureEventExists: EnsureEventExists,
    @Inject(EVENT_PARTICIPANTS_REPOSITORY)
    private readonly eventParticipantRepository: EventParticipantsRepositoryInterface,
  ) {}

  async execute(
    personId: string,
    eventId: string,
    status: SetParticipationStatusDto,
  ): Promise<EventParticipantsResponseDto> {
    const person = await this.ensurePersonExists.ensure(personId);
    const event = await this.ensureEventExists.ensure(eventId);
    if (event.isFinalStatus()) {
      throw new EventInFinalStatusError();
    }
    if (event.isEventStatusPending()) {
      throw new EventInPendingStatusError();
    }
    const eventParticipant =
      await this.eventParticipantRepository.findWithPersonIdAndEventId(
        person,
        event,
      );
    if (!eventParticipant) {
      return await this.createParticipation(event, person, status);
    }
    return await this.updateParticipation(
      eventParticipant,
      event,
      person,
      status,
    );
  }

  private async createParticipation(
    event: EventsDomainEntity,
    person: PersonDomainEntity,
    status: SetParticipationStatusDto,
  ): Promise<EventParticipantsResponseDto> {
    const eventParticipant = EventParticipantsDomainEntity.create({
      event: event,
      person: person,
      status: status.status,
    });
    const created =
      await this.eventParticipantRepository.persist(eventParticipant);
    return EventParticipantsResponseMapper.toResponse(created, event, person);
  }

  private async updateParticipation(
    eventParticipant: EventParticipantsDomainEntity,
    event: EventsDomainEntity,
    person: PersonDomainEntity,
    status: SetParticipationStatusDto,
  ): Promise<EventParticipantsResponseDto> {
    eventParticipant.updateStatus(status.status);

    const updatedEventParticipant =
      await this.eventParticipantRepository.persist(eventParticipant);

    return EventParticipantsResponseMapper.toResponse(
      updatedEventParticipant,
      event,
      person,
    );
  }
}
