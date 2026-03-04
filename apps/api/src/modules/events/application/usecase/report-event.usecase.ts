import { Inject, Injectable } from '@nestjs/common';
import { EventReportResponseDto } from '../responses/event-reports/event-report.response-dto';
import { CreateEventReportDto } from '../dto/create-event-report.dto';
import { EnsurePersonExists } from '../validators/ensure-person-exist.validator';
import { PersonIdNotFoundError } from 'src/shared/errors/person-id-not-found.error';
import { EventIdNotFoundError } from 'src/shared/errors/event-id-not-found.error';
import { EnsureEventExists } from '../validators/ensure-event-exist.validator';
import { EnsureEventAlreadyNotReportedByUser } from '../validators/ensure-event-not-reported-by-user.validator';
import { EventReportDomainEntity } from 'src/modules/event-reports/domain/event-report.domain-entity';
import { EVENT_REPORT_REPOSITORY, type EventReportRepositoryInterface } from 'src/modules/event-reports/domain/event-report.repository-interface';

@Injectable()
export class ReportEventUseCase {
  constructor(
    @Inject(EVENT_REPORT_REPOSITORY)
    private readonly eventReportRepository: EventReportRepositoryInterface,
    @Inject()
    private readonly ensurePersonExist: EnsurePersonExists,
    @Inject()
    private readonly ensureEventExist: EnsureEventExists,
    @Inject()
    private readonly ensureEventAlreadyNotReportedByUser: EnsureEventAlreadyNotReportedByUser,
  ) {}

  async report(
    userPersonId: string,
    eventId: string,
    dto: CreateEventReportDto,
  ): Promise<EventReportResponseDto> {
    if (!userPersonId) {
      throw new PersonIdNotFoundError();
    }
    if (!eventId) {
      throw new EventIdNotFoundError();
    }
    const userPerson = await this.ensurePersonExist.ensure(userPersonId);
    const event = await this.ensureEventExist.ensure(eventId);
    await this.ensureEventAlreadyNotReportedByUser.ensure(
      userPerson.id,
      event.id,
    );
    const newEventReport = EventReportDomainEntity.create({
      event: event,
      reporter: userPerson,
      reason: dto.reason,
    });
    await this.eventReportRepository.persist(newEventReport);
    throw new Error(`Parando erro de retorno`);
  }
}
