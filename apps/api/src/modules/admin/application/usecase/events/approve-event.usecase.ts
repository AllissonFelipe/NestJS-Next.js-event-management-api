import { Inject } from '@nestjs/common';
import { AdminEnsureEventExistsValidator } from '../../validators/ensure-event-exist.validator';
import { IsAdminValidator } from '../../validators/is-admin.validator';
import {
  EVENTS_REPOSITORY,
  type EventsRepositoryInterface,
} from 'src/modules/events/domain/events.repository-interface';
import { EventPresenter } from '../../response/event/event-presenter';
import { EventResponseDto } from '../../response/event/event-response.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventsStatusEnum } from 'src/modules/events/domain/events-status.enum';
import { EventIsAlreadyApprovedError } from 'src/modules/events/domain/errors/event-is-already-approved.error';

export class AdminApproveEventUseCase {
  constructor(
    @Inject(EVENTS_REPOSITORY)
    private readonly eventRepository: EventsRepositoryInterface,
    @Inject()
    private readonly isAdminValidator: IsAdminValidator,
    @Inject()
    private readonly ensureEventExistsValidator: AdminEnsureEventExistsValidator,
    @Inject()
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    adminPersonId: string,
    eventId: string,
  ): Promise<EventResponseDto> {
    await this.isAdminValidator.validate(adminPersonId);
    const event =
      await this.ensureEventExistsValidator.ensureByEventId(eventId);
    if (event.status === EventsStatusEnum.APPROVED) {
      throw new EventIsAlreadyApprovedError();
    }
    event.markAsApproved();
    const result = await this.eventRepository.saveEvent(event);
    this.eventEmitter.emit('event.approved', result);
    return EventPresenter.toResponse(result, result.address);
  }
}
