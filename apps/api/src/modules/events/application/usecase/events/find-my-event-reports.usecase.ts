import { Inject, Injectable } from '@nestjs/common';
import {
  MyEventReportResponseDto,
  MyEventsReportsWithQueryResponseDto,
} from '../../responses/event-reports/my-event-report.response-dto';
import { MyEventReportsQueryDto } from '../../dto/my-event-reports-query.dto';
import { EnsurePersonExists } from '../../validators/ensure-person-exist.validator';
import {
  EVENT_REPORT_REPOSITORY,
  type EventReportRepositoryInterface,
} from 'src/modules/event-reports/domain/event-report.repository-interface';
import {
  MyEventReportResponseMapper,
  MyEventsReportsWithQueryResponseMapper,
} from '../../responses/event-reports/my-event-report.response-mapper';
import { PaginationInterface } from 'src/modules/event-reports/domain/pagination.interface';
import { EnsureEventExists } from '../../validators/ensure-event-exist.validator';
import { EventReportNotFoundError } from '../../../domain/errors/event-report-not-found.error';

@Injectable()
export class FindMyEventReportsUseCase {
  constructor(
    @Inject()
    private readonly ensurePersonExist: EnsurePersonExists,
    @Inject()
    private readonly ensureEventExist: EnsureEventExists,
    @Inject(EVENT_REPORT_REPOSITORY)
    private readonly eventReportRepository: EventReportRepositoryInterface,
  ) {}

  async execute(
    userPersonId: string,
    queryDto: MyEventReportsQueryDto,
  ): Promise<MyEventsReportsWithQueryResponseDto> {
    await this.ensurePersonExist.ensure(userPersonId);

    const pagination: PaginationInterface = {
      page: queryDto.page ?? 1,
      limit: queryDto.limit ?? 10,
    };

    const { items, total } =
      await this.eventReportRepository.findAllMyEventsReports(
        userPersonId,
        queryDto,
        pagination,
      );

    return MyEventsReportsWithQueryResponseMapper.toResponse(
      items,
      pagination.page,
      pagination.limit,
      total,
    );
  }

  async executeFindOne(
    userPersonId: string,
    eventId: string,
  ): Promise<MyEventReportResponseDto> {
    const userPerson = await this.ensurePersonExist.ensure(userPersonId);
    const event = await this.ensureEventExist.ensure(eventId);
    const eventReport =
      await this.eventReportRepository.findByPersonIdAndEventId(
        userPerson.id,
        event.id,
      );
    if (!eventReport) {
      throw new EventReportNotFoundError();
    }
    return MyEventReportResponseMapper.toResponse(
      eventReport,
      eventReport.event,
      eventReport.reporter,
    );
  }
}
