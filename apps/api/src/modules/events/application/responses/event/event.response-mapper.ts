import { EventsDomainEntity } from 'src/modules/events/domain/events.domain-entity';
import { EventsAddressDomainEntity } from 'src/modules/events/events-addresses/domain/events-addresses.domain-entity';
import {
  EventAddressResponseDto,
  EventPaginationDto,
  EventParticipantsResponseDto,
  EventResponseDto,
  EventWithPaginationResponseDto,
  EventWithParticipantsResponseDto,
} from './event.response-dto';
import { EventParticipantStatusEnum } from 'src/modules/event-participants/domain/event-participants.status-enum';
import { PersonDomainEntity } from 'src/modules/person/domain/person.domain-entity';
export class EventWithPaginationResponseMapper {
  static toResponse(
    events: EventsDomainEntity[],
    page: number,
    limit: number,
    total: number,
  ): EventWithPaginationResponseDto {
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const meta: EventPaginationDto = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: totalPages > page,
      hasPreviousPage: page > 1,
    };
    return {
      items: events.map((event) => {
        return EventResponseMapper.toResponse(event);
      }),
      meta,
    };
  }
}
export class EventResponseMapper {
  static toResponse(event: EventsDomainEntity): EventResponseDto {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      startAt: event.startAt,
      endAt: event.endAt,
      status: event.status,
      address: EventAddressResponseMapper.toResponse(event.address),
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      createdBy: {
        id: event.createdBy.id,
        fullName: event.createdBy.fullName,
        avatarUrl: event.createdBy.personProfile.avatarUrl,
      },
      goingCount: event.participants.filter(
        (participants) =>
          participants.status === EventParticipantStatusEnum.GOING,
      ).length,
      interestedCount: event.participants.filter(
        (participants) =>
          participants.status === EventParticipantStatusEnum.INTERESTED,
      ).length,
    };
  }
}
export class EventWithParticipantsResponseMapper {
  static toResponse(
    event: EventsDomainEntity,
  ): EventWithParticipantsResponseDto {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      startAt: event.startAt,
      endAt: event.endAt,
      status: event.status,
      address: EventAddressResponseMapper.toResponse(event.address),
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      createdBy: {
        id: event.createdBy.id,
        fullName: event.createdBy.fullName,
        avatarUrl: event.createdBy.personProfile.avatarUrl,
      },
      going: {
        count: event.participants.filter(
          (participants) =>
            participants.status === EventParticipantStatusEnum.GOING,
        ).length,
        participants: event.participants
          .filter(
            (participant) =>
              participant.status === EventParticipantStatusEnum.GOING,
          )
          .map((participant) =>
            EventParticipantsResponseMapper.toResponse(participant.person),
          ),
      },
      interested: {
        count: event.participants.filter(
          (participants) =>
            participants.status === EventParticipantStatusEnum.INTERESTED,
        ).length,
        participants: event.participants
          .filter(
            (participant) =>
              participant.status === EventParticipantStatusEnum.INTERESTED,
          )
          .map((participant) =>
            EventParticipantsResponseMapper.toResponse(participant.person),
          ),
      },
    };
  }
}
export class EventAddressResponseMapper {
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

// export class EventWithParticipantsResponseMapper {
//   static toResponse(
//     event: EventsDomainEntity,
//   ): EventWithParticipantsResponseDto {}
// }
export class EventParticipantsResponseMapper {
  static toResponse(
    eventParticipants: PersonDomainEntity,
  ): EventParticipantsResponseDto {
    return {
      id: eventParticipants.id,
      fullName: eventParticipants.fullName,
      avatarUrl: eventParticipants.personProfile.avatarUrl ?? '',
    };
  }
}
