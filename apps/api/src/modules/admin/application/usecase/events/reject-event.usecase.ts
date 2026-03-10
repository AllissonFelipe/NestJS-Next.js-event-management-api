import { Inject, Injectable } from '@nestjs/common';
import { EventResponseDto } from '../../response/event/event-response.dto';
import {
  EVENTS_REPOSITORY,
  type EventsRepositoryInterface,
} from 'src/modules/events/domain/events.repository-interface';
import { IsAdminValidator } from '../../validators/is-admin.validator';
import { AdminEnsureEventExistsValidator } from '../../validators/ensure-event-exist.validator';
import { EventPresenter } from '../../response/event/event-presenter';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AdminRejectEventUseCase {
  constructor(
    @Inject(EVENTS_REPOSITORY)
    private readonly eventsRepository: EventsRepositoryInterface,
    @Inject()
    private readonly isAdminValidator: IsAdminValidator,
    @Inject()
    private readonly ensureEventExists: AdminEnsureEventExistsValidator,
    @Inject()
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    adminPersonId: string,
    eventId: string,
    reason?: string,
  ): Promise<EventResponseDto> {
    await this.isAdminValidator.validate(adminPersonId);
    const event = await this.ensureEventExists.ensureByEventId(eventId);
    event.markAsRejected();
    const result = await this.eventsRepository.saveEvent(event);
    this.eventEmitter.emit('event.rejected', result, reason);
    return EventPresenter.toResponse(result, result.address);
  }
}
