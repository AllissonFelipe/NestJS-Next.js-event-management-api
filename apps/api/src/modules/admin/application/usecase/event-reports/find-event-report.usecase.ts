import { Inject, Injectable } from '@nestjs/common';
import { IsAdminValidator } from '../../validators/is-admin.validator';
import { AdminEnsureEventExistsValidator } from '../../validators/ensure-event-exist.validator';
import {
  EVENT_REPORT_REPOSITORY,
  type EventReportRepositoryInterface,
} from 'src/modules/event-reports/domain/event-report.repository-interface';
import { FindEventReportQueryDto } from '../../dtos/find-event-report-query.dto';
import { AdminPaginationInterface } from 'src/modules/admin/domain/pagination.interface';
import { AdminEventsReportsWithQueryResponseMapper } from '../../response/event-report/admin-event-report-response.mapper';
import { AdminEventsReportsWithQueryResponseDto } from '../../response/event-report/admin-event-report-response.dto';

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

  async findAllOfEvent(
    adminPersonId: string,
    eventId: string,
    query: FindEventReportQueryDto,
  ): Promise<AdminEventsReportsWithQueryResponseDto> {
    await this.isAdminValidator.validate(adminPersonId);
    const event = await this.ensureEventExistValidator.ensure(eventId);

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
}
