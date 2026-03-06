import { EventReportDomainEntity } from 'src/modules/event-reports/domain/event-report.domain-entity';
import { PersonDomainEntity } from 'src/modules/person/domain/person.domain-entity';
import {
  AdminEventReportEventCreatedByResponseDto,
  AdminEventReportEventResponseDto,
  AdminEventReportResponseDto,
  AdminEventsReportsWithQueryResponseDto,
} from './admin-event-report-response.dto';
import { EventsDomainEntity } from 'src/modules/events/domain/events.domain-entity';

export class AdminEventsReportsWithQueryResponseMapper {
  static toResponse(
    eventReportDomain: EventReportDomainEntity[],
    page: number,
    limit: number,
    total: number,
  ): AdminEventsReportsWithQueryResponseDto {
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return {
      items: eventReportDomain.map((eventReport) =>
        AdminEventReportResponseMapper.toResponse(
          eventReport,
          eventReport.event,
          eventReport.event.createdBy,
        ),
      ),
      meta: {
        page,
        limit,
        total,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
}
export class AdminEventReportResponseMapper {
  static toResponse(
    eventReportDomain: EventReportDomainEntity,
    eventDomain: EventsDomainEntity,
    userPersonDomain: PersonDomainEntity,
  ): AdminEventReportResponseDto {
    return {
      id: eventReportDomain.id,
      event: AdminEventReportEventResponseMapper.toResponse(
        eventDomain,
        userPersonDomain,
      ),
      reason: eventReportDomain.reason,
      status: eventReportDomain.status,
      createdAt: eventReportDomain.createdAt,
    };
  }
}
export class AdminEventReportEventResponseMapper {
  static toResponse(
    eventDomain: EventsDomainEntity,
    userPersonDomain: PersonDomainEntity,
  ): AdminEventReportEventResponseDto {
    return {
      id: eventDomain.id,
      title: eventDomain.title,
      description: eventDomain.description,
      startAt: eventDomain.startAt,
      endAt: eventDomain.endAt,
      createdBy:
        AdminEventReportEventCreatedByResponseMapper.toResponse(
          userPersonDomain,
        ),
    };
  }
}
export class AdminEventReportEventCreatedByResponseMapper {
  static toResponse(
    userPersonDomain: PersonDomainEntity,
  ): AdminEventReportEventCreatedByResponseDto {
    return {
      id: userPersonDomain.id,
      name: userPersonDomain.fullName,
      avatarUrl: userPersonDomain.personProfile.avatarUrl
        ? userPersonDomain.personProfile.avatarUrl
        : undefined,
    };
  }
}
