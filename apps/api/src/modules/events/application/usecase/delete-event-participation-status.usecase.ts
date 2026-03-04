import { Inject, Injectable } from '@nestjs/common';
import { EnsureEventExists } from '../validators/ensure-event-exist.validator';
import { EnsurePersonExists } from '../validators/ensure-person-exist.validator';
import { EnsureUserEventParticipationExist } from '../validators/ensure-user-event-participation-exist.validator';
import {
  EVENT_PARTICIPANTS_REPOSITORY,
  type EventParticipantsRepositoryInterface,
} from 'src/modules/event-participants/domain/event-participants.repository-interface';
import { PersonIdNotFoundError } from 'src/shared/errors/person-id-not-found.error';
import { EventIdNotFoundError } from 'src/shared/errors/event-id-not-found.error';

@Injectable()
export class DeleteEventParticipationStatusUseCase {
  constructor(
    @Inject(EVENT_PARTICIPANTS_REPOSITORY)
    private readonly eventParticipantRepository: EventParticipantsRepositoryInterface,
    @Inject()
    private readonly ensureEventExist: EnsureEventExists,
    @Inject()
    private readonly ensurePersonExist: EnsurePersonExists,
    @Inject()
    private readonly ensureUserEventParticipationExist: EnsureUserEventParticipationExist,
  ) {}

  async execute(userPersonId: string, eventId: string): Promise<void> {
    if (!userPersonId) {
      throw new PersonIdNotFoundError();
    }
    if (!eventId) {
      throw new EventIdNotFoundError();
    }
    const personUserRole = await this.ensurePersonExist.ensure(userPersonId);
    const event = await this.ensureEventExist.ensure(eventId);
    const eventParticipation =
      await this.ensureUserEventParticipationExist.ensure(
        personUserRole,
        event,
      );
    await this.eventParticipantRepository.deleteParticipationOfUser(
      eventParticipation.id,
    );
  }
}
