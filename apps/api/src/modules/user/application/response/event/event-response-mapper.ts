import { EventsDomainEntity } from 'src/modules/events/domain/events.domain-entity';
import {
  EventAddressDetailsDto,
  EventCreatedByDetailsDto,
  EventDetailsDto,
  EventPaginationDetailsDto,
  EventPaginationReponseDto,
  EventResponseDto,
} from './event-response.dto';
import { EventsAddressDomainEntity } from 'src/modules/events/events-addresses/domain/events-addresses.domain-entity';
import { PersonDomainEntity } from 'src/modules/person/domain/person.domain-entity';
import { EventAddressNotFoundError } from 'src/modules/events/domain/errors/event-address-not-found.error';

export class EventPaginationResponseMapper {
  static toResponse(
    events: EventsDomainEntity[],
    page: number,
    limit: number,
    total: number,
  ): EventPaginationReponseDto {
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const hasNextPage = totalPages > page;
    const hasPreviousPage = page > 1;
    const meta: EventPaginationDetailsDto = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };
    return {
      events: events.map((event) => {
        if (!event.address) {
          throw new EventAddressNotFoundError();
        }
        return EventResponseMapper.toResponse(event);
      }),
      meta,
    };
  }
}
export class EventResponseMapper {
  static toResponse(event: EventsDomainEntity): EventResponseDto {
    return {
      event: EventMapper.toResponse(event, event.createdBy, event.address),
    };
  }
}
export class EventMapper {
  static toResponse(
    event: EventsDomainEntity,
    user: PersonDomainEntity,
    eventAddress: EventsAddressDomainEntity,
  ): EventDetailsDto {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      startAt: event.startAt,
      endAt: event.endAt,
      status: event.status,
      createdBy: EventCreatedByMapper.toResponse(user),
      eventAddress: EventAddressMapper.toResponse(eventAddress),
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }
}
export class EventAddressMapper {
  static toResponse(
    eventAddress: EventsAddressDomainEntity,
  ): EventAddressDetailsDto {
    return {
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
export class EventCreatedByMapper {
  static toResponse(user: PersonDomainEntity): EventCreatedByDetailsDto {
    return {
      id: user.id,
      fullName: user.fullName,
      avatarUrl: user.personProfile.avatarUrl
        ? user.personProfile.avatarUrl
        : undefined,
    };
  }
}
