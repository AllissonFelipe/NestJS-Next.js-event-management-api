import { EventsAddressDomainEntity } from 'src/modules/events/events-addresses/domain/events-addresses.domain-entity';
import {
  EventAddressResponseDto,
  EventPaginationDto,
  EventResponseDto,
  EventResponseWithPaginationDto,
} from './event-response.dto';
import { EventsDomainEntity } from 'src/modules/events/domain/events.domain-entity';
import { EventAddressNotFoundError } from 'src/modules/events/domain/errors/event-address-not-found.error';

export class EventPresenter {
  static toResponse(
    event: EventsDomainEntity,
    eventAddress: EventsAddressDomainEntity,
  ): EventResponseDto {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      startAt: event.startAt,
      endAt: event.endAt,
      status: event.status,
      address: EventAddressPresenter.toResponse(eventAddress),
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      createdBy: {
        id: event.createdBy.id,
        fullName: event.createdBy.fullName,
        avatarUrl: event.createdBy.personProfile.avatarUrl,
      },
    };
  }
}

export class EventPresenterWithPagination {
  static toResponse(
    events: EventsDomainEntity[],
    page: number,
    limit: number,
    total: number,
  ): EventResponseWithPaginationDto {
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const meta: EventPaginationDto = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return {
      items: events.map((event) => {
        if (!event.address) {
          throw new EventAddressNotFoundError();
        }
        return EventPresenter.toResponse(event, event.address);
      }),
      meta,
    };
  }
}

export class EventAddressPresenter {
  static toResponse(
    eventAddress: EventsAddressDomainEntity,
  ): EventAddressResponseDto {
    return {
      id: eventAddress.id,
      street: eventAddress.street,
      number: eventAddress.number,
      complement: eventAddress.complement,
      neighborhood: eventAddress.neighborhood,
      city: eventAddress.city,
      state: eventAddress.state,
      zipCode: eventAddress.zipCode,
    };
  }
}
