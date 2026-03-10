import { Inject, Injectable } from '@nestjs/common';
import { IsAdminValidator } from '../../validators/is-admin.validator';
import { AdminEnsureEventExistsValidator } from '../../validators/ensure-event-exist.validator';
import {
  EVENT_REPORT_REPOSITORY,
  type EventReportRepositoryInterface,
} from 'src/modules/event-reports/domain/event-report.repository-interface';
import { FindEventReportQueryDto } from '../../dtos/find-event-report-query.dto';
import { AdminPaginationInterface } from 'src/modules/admin/domain/pagination.interface';
import {
  AdminEventReportResponseMapper,
  AdminEventsReportsWithQueryResponseMapper,
} from '../../response/event-report/admin-event-report-response.mapper';
import {
  AdminEventReportResponseDto,
  AdminEventsReportsWithQueryResponseDto,
} from '../../response/event-report/admin-event-report-response.dto';
import { AdminEventReportNotFoundError } from 'src/modules/admin/domain/errors/admin-event-report-not-found.error';

@Injectable()
export class AdminFindEventReportUseCase {
  constructor(
    @Inject()
    private readonly isAdminValidator: IsAdminValidator,
    @Inject()
    private readonly ensureEventExistValidator: AdminEnsureEventExistsValidator,
    @Inject(EVENT_REPORT_REPOSITORY)
    private readonly eventReportRepository: EventReportRepositoryInterface,
  ) {}

  async findAllReportsOfEvent(
    adminPersonId: string,
    eventId: string,
    query: FindEventReportQueryDto,
  ): Promise<AdminEventsReportsWithQueryResponseDto> {
    await this.isAdminValidator.validate(adminPersonId);
    const event = await this.ensureEventExistValidator.ensureByEventId(eventId);

    const pagination: AdminPaginationInterface = {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    };

    const result = await this.eventReportRepository.findAllOfEvent(
      event.id,
      query,
      pagination,
    );

    return AdminEventsReportsWithQueryResponseMapper.toResponse(
      result.items,
      pagination.page,
      pagination.limit,
      result.total,
    );
  }

  async findAllReports(
    adminPersonId: string,
    query: FindEventReportQueryDto,
  ): Promise<AdminEventsReportsWithQueryResponseDto> {
    await this.isAdminValidator.validate(adminPersonId);

    const pagination: AdminPaginationInterface = {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    };

    const result = await this.eventReportRepository.findAll(query, pagination);

    return AdminEventsReportsWithQueryResponseMapper.toResponse(
      result.items,
      pagination.page,
      pagination.limit,
      result.total,
    );
  }

  async findOneReportOfEvent(
    adminPersonId: string,
    eventId: string,
    eventReportId: string,
  ): Promise<AdminEventReportResponseDto> {
    await this.isAdminValidator.validate(adminPersonId);

    const event = await this.ensureEventExistValidator.ensureByEventId(eventId);

    const result = await this.eventReportRepository.findOneReportOfEvent(
      event.id,
      eventReportId,
    );

    if (!result) {
      throw new AdminEventReportNotFoundError();
    }

    return AdminEventReportResponseMapper.toResponse(
      result,
      result.event,
      result.event.createdBy,
    );
  }
}
