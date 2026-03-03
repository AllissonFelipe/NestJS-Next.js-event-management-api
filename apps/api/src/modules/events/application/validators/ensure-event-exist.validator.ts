import { Inject, Injectable } from '@nestjs/common';
import { EventsDomainEntity } from '../../domain/events.domain-entity';
import {
  EVENTS_REPOSITORY,
  type EventsRepositoryInterface,
} from '../../domain/events.repository-interface';
import { EventIdNotFoundError } from 'src/shared/errors/event-id-not-found.error';
import { EventNotFoundError } from 'src/shared/errors/event-not-found.error';

@Injectable()
export class EnsureEventExists {
  constructor(
    @Inject(EVENTS_REPOSITORY)
    private readonly eventsRepository: EventsRepositoryInterface,
  ) {}

  async ensure(eventId: string): Promise<EventsDomainEntity> {
    if (!eventId) {
      throw new EventIdNotFoundError(eventId);
    }
    const event = await this.eventsRepository.findByEventId(eventId);
    if (!event) {
      throw new EventNotFoundError(eventId);
    }
    return event;
  }
}
