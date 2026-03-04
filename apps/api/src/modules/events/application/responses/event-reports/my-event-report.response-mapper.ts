import { EventReportDomainEntity } from 'src/modules/event-reports/domain/event-report.domain-entity';
import {
  MyEventReportEventCreatedByResponseDto,
  MyEventReportEventResponseDto,
  MyEventReportResponseDto,
} from './my-event-report.response-dto';
import { EventsDomainEntity } from 'src/modules/events/domain/events.domain-entity';
import { PersonDomainEntity } from 'src/modules/person/domain/person.domain-entity';

export class MyEventReportResponseMapper {
  static toResponse(
    eventReportDomain: EventReportDomainEntity,
    eventDomain: EventsDomainEntity,
    userPersonDomain: PersonDomainEntity,
  ): MyEventReportResponseDto {
    return {
      id: eventReportDomain.id,
      event: MyEventReportEventResponseMapper.toResponse(
        eventDomain,
        userPersonDomain,
      ),
      reason: eventReportDomain.reason,
      status: eventReportDomain.status,
      createdAt: eventReportDomain.createdAt,
    };
  }
}
export class MyEventReportEventResponseMapper {
  static toResponse(
    eventDomain: EventsDomainEntity,
    userPersonDomain: PersonDomainEntity,
  ): MyEventReportEventResponseDto {
    return {
      id: eventDomain.id,
      title: eventDomain.title,
      description: eventDomain.description,
      startAt: eventDomain.startAt,
      endAt: eventDomain.endAt,
      createdBy:
        MyEventReportEventCreatedByResponseMapper.toResponse(userPersonDomain),
    };
  }
}
export class MyEventReportEventCreatedByResponseMapper {
  static toResponse(
    userPersonDomain: PersonDomainEntity,
  ): MyEventReportEventCreatedByResponseDto {
    return {
      id: userPersonDomain.id,
      name: userPersonDomain.fullName,
      avatarUrl: userPersonDomain.personProfile.avatarUrl
        ? userPersonDomain.personProfile.avatarUrl
        : undefined,
    };
  }
}
