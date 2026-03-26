import { Inject, Injectable } from '@nestjs/common';
import { EventReportDomainEntity } from 'src/modules/event-reports/domain/event-report.domain-entity';
import {
  EVENT_REPORT_REPOSITORY,
  type EventReportRepositoryInterface
} from 'src/modules/event-reports/domain/event-report.repository-interface';
import { AdminEventReportNotFoundError } from '../../domain/errors/admin-event-report-not-found.error';

@Injectable()
export class AdminEnsureEventReportExistsValidator {
  constructor(
    @Inject(EVENT_REPORT_REPOSITORY)
    private readonly eventReportRepository: EventReportRepositoryInterface
  ) {}

  async executeByEventIdAndEventReportId(eventId: string, eventReportId: string): Promise<EventReportDomainEntity> {
    const eventReport = await this.eventReportRepository.findOneReportOfEvent(eventId, eventReportId);
    if (!eventReport) {
      throw new AdminEventReportNotFoundError();
    }
    return eventReport;
  }
}
