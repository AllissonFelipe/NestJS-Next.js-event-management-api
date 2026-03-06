import { Inject, Injectable } from '@nestjs/common';
import { EventsDomainEntity } from 'src/modules/events/domain/events.domain-entity';
import {
  EVENTS_REPOSITORY,
  type EventsRepositoryInterface,
} from 'src/modules/events/domain/events.repository-interface';
import { EventNotFoundError } from '../../domain/errors/admin-event-not-found.error';
import { EventIdNotFoundError } from '../../domain/errors/admin-event-id-not-found.error';

@Injectable()
export class AdminEnsureEventExistsValidator {
  constructor(
    @Inject(EVENTS_REPOSITORY)
    private readonly eventsRepository: EventsRepositoryInterface,
  ) {}

  async ensure(eventId: string): Promise<EventsDomainEntity> {
    if (!eventId) {
      throw new EventIdNotFoundError();
    }
    const event = await this.eventsRepository.findByEventId(eventId);
    if (!event) {
      throw new EventNotFoundError();
    }
    return event;
  }
}
