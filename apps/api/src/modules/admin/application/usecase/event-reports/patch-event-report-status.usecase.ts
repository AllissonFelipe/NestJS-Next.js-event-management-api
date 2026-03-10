import { Inject, Injectable } from '@nestjs/common';
import { AdminEventReportResponseDto } from '../../response/event-report/admin-event-report-response.dto';
import {
  EVENT_REPORT_REPOSITORY,
  type EventReportRepositoryInterface,
} from 'src/modules/event-reports/domain/event-report.repository-interface';
import { IsAdminValidator } from '../../validators/is-admin.validator';
import { AdminEnsureEventExistsValidator } from '../../validators/ensure-event-exist.validator';
import { AdminEventReportResponseMapper } from '../../response/event-report/admin-event-report-response.mapper';
import { AdminEnsureEventReportExistsValidator } from '../../validators/ensure-event-report-exist.validator';

@Injectable()
export class AdminPatchEventReportStatusUseCase {
  constructor(
    @Inject(EVENT_REPORT_REPOSITORY)
    private readonly eventReportRepository: EventReportRepositoryInterface,
    @Inject()
    private readonly isAdminValidator: IsAdminValidator,
    @Inject()
    private readonly ensureEventExists: AdminEnsureEventExistsValidator,
    @Inject()
    private readonly ensureEventReportExists: AdminEnsureEventReportExistsValidator,
  ) {}

  async executeReviewed(
    adminPersonId: string,
    eventId: string,
    eventReportId: string,
  ): Promise<AdminEventReportResponseDto> {
    await this.isAdminValidator.validate(adminPersonId);
    const event = await this.ensureEventExists.ensureByEventId(eventId);
    const eventReport =
      await this.ensureEventReportExists.executeByEventIdAndEventReportId(
        event.id,
        eventReportId,
      );
    eventReport.markAsReviewed();
    const result = await this.eventReportRepository.persist(eventReport);
    return AdminEventReportResponseMapper.toResponse(
      result,
      result.event,
      result.event.createdBy,
    );
  }

  async executeResolved(
    adminPersonId: string,
    eventId: string,
    eventReportId: string,
  ): Promise<AdminEventReportResponseDto> {
    await this.isAdminValidator.validate(adminPersonId);
    const event = await this.ensureEventExists.ensureByEventId(eventId);
    const eventReport =
      await this.ensureEventReportExists.executeByEventIdAndEventReportId(
        event.id,
        eventReportId,
      );
    eventReport.markAsResolved();
    const result = await this.eventReportRepository.persist(eventReport);
    return AdminEventReportResponseMapper.toResponse(
      result,
      result.event,
      result.event.createdBy,
    );
  }

  async executeOpen(
    adminPersonId: string,
    eventId: string,
    eventReportId: string,
  ): Promise<AdminEventReportResponseDto> {
    await this.isAdminValidator.validate(adminPersonId);
    const event = await this.ensureEventExists.ensureByEventId(eventId);
    const eventReport =
      await this.ensureEventReportExists.executeByEventIdAndEventReportId(
        event.id,
        eventReportId,
      );
    eventReport.markAsOpen();
    const result = await this.eventReportRepository.persist(eventReport);
    return AdminEventReportResponseMapper.toResponse(
      result,
      result.event,
      result.event.createdBy,
    );
  }
}
