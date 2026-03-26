import { Inject, Injectable } from '@nestjs/common';
import { AdminEventReportResponseDto } from '../../response/event-report/admin-event-report-response.dto';
import {
  EVENT_REPORT_REPOSITORY,
  type EventReportRepositoryInterface,
} from 'src/modules/event-reports/domain/event-report.repository-interface';
import { IsAdminValidator } from '../../validators/is-admin.validator';
import { AdminEventReportResponseMapper } from '../../response/event-report/admin-event-report-response.mapper';
import { UpdateEventReportStatusDto } from '../../dtos/update-event-report-status.dto';
import { AdminEventReportNotFoundError } from 'src/modules/admin/domain/errors/admin-event-report-not-found.error';

@Injectable()
export class AdminUpdateEventReportStatusUseCase {
  constructor(
    @Inject(EVENT_REPORT_REPOSITORY)
    private readonly eventReportRepository: EventReportRepositoryInterface,
    @Inject()
    private readonly isAdminValidator: IsAdminValidator,
  ) {}

  async execute(
    adminPersonId: string,
    eventReportId: string,
    dto: UpdateEventReportStatusDto,
  ): Promise<AdminEventReportResponseDto> {
    await this.isAdminValidator.validate(adminPersonId);
    const eventReport = await this.eventReportRepository.findOneReport(eventReportId);
    if (!eventReport) {
      throw new AdminEventReportNotFoundError();
    }
    if (eventReport.status === dto.status) {
      return AdminEventReportResponseMapper.toResponse(
        eventReport,
        eventReport.event,
        eventReport.reporter,
      );
    }
    eventReport.updateStatus(dto.status);
    const result = await this.eventReportRepository.persist(eventReport);
    return AdminEventReportResponseMapper.toResponse(result, result.event, result.reporter);
  }
}
