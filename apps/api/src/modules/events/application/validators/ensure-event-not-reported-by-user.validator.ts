import { Inject } from '@nestjs/common';
import {
  EVENT_REPORT_REPOSITORY,
  type EventReportRepositoryInterface,
} from 'src/modules/event-reports/domain/event-report.repository-interface';
import { EventAlreadyReportedByUser } from 'src/shared/errors/event-already-reported-by-user.error';

export class EnsureEventAlreadyNotReportedByUser {
  constructor(
    @Inject(EVENT_REPORT_REPOSITORY)
    private readonly eventReportRepository: EventReportRepositoryInterface,
  ) {}

  async ensure(userPersonId: string, eventId: string): Promise<void> {
    const eventReport =
      await this.eventReportRepository.findByPersonIdAndEventId(
        userPersonId,
        eventId,
      );
    if (eventReport) {
      throw new EventAlreadyReportedByUser();
    }
  }
}
