import { Inject, Injectable } from '@nestjs/common';
import {
  EVENTS_REPOSITORY,
  type EventsRepositoryInterface,
} from '../../../domain/events.repository-interface';
import { EventsStatusEnum } from '../../../domain/events-status.enum';
import { FindEventFilters } from '../../dto/find-event-filters.dto';
import {
  EventWithPaginationResponseMapper,
  EventWithParticipantsResponseMapper,
} from '../../responses/event/event.response-mapper';
import {
  EventWithPaginationResponseDto,
  EventWithParticipantsResponseDto,
} from '../../responses/event/event.response-dto';
import { EventAddressNotFoundError } from 'src/shared/errors/event-address-not-found-error';
import { EventNotFoundError } from '../../../domain/errors/event-not-found-error';

@Injectable()
export class FindEventsUseCase {
  constructor(
    @Inject(EVENTS_REPOSITORY)
    private readonly eventsRepository: EventsRepositoryInterface,
  ) {}

  // FIND EVENTS - ROTA PÚBLICA
  async findAllPublicEvents(
    filters: FindEventFilters,
  ): Promise<EventWithPaginationResponseDto> {
    const { items, total } =
      await this.eventsRepository.findAllPublicEventsWithFilters(filters);

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;

    const now = new Date();

    items.forEach((event) => {
      if (!event.address) {
        throw new EventAddressNotFoundError(event.id);
      }
      if (event.status === EventsStatusEnum.APPROVED) {
        event.updateStatus(
          this.resolveCurrentStatus(event.startAt, event.endAt, now),
        );
      }
    });
    return EventWithPaginationResponseMapper.toResponse(
      items,
      page,
      limit,
      total,
    );
  }

  // FIND ONE EVENT - ROTA PÚBLICA
  async findOnePublicEvent(
    eventId: string,
  ): Promise<EventWithParticipantsResponseDto> {
    const event = await this.eventsRepository.findByEventId(eventId);
    if (!event) {
      throw new EventNotFoundError();
    }
    event.updateStatus(
      this.resolveCurrentStatus(event.startAt, event.endAt, new Date()),
    );
    return EventWithParticipantsResponseMapper.toResponse(event);
  }

  // MÉTODO PRIVADO PARA ALTERAR O STATUS DE EVENTOS APROVADOS
  // ALTERAR SOMENTE NA MEMÓRIA E NÃO NO BANCO DE DADOS
  // POR ENQUANTO
  private resolveCurrentStatus(startAt: Date, endAt: Date, now: Date) {
    if (startAt > now) return EventsStatusEnum.UPCOMING;
    if (endAt < now) return EventsStatusEnum.CONCLUDED;
    return EventsStatusEnum.IN_PROGRESS;
  }
}
