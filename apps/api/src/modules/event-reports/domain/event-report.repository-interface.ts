import { EntityManager } from 'typeorm';
import { EventReportDomainEntity } from './event-report.domain-entity';
import { PaginatedResult } from 'src/modules/events/domain/paginated-result.interface';
import { MyEventReportsQueryDto } from 'src/modules/events/application/dto/my-event-reports-query.dto';
import { PaginationInterface } from './pagination.interface';

export const EVENT_REPORT_REPOSITORY = Symbol('EVENT_REPORT_REPOSITORY');

export interface EventReportRepositoryInterface {
  persist(
    eventReportDomain: EventReportDomainEntity,
    manager?: EntityManager,
  ): Promise<EventReportDomainEntity>;
  findByPersonIdAndEventId(
    personId: string,
    eventId: string,
    manager?: EntityManager,
  ): Promise<EventReportDomainEntity | null>;
  findAllMyEventsReports(
    userPersonId: string,
    queryDto: MyEventReportsQueryDto,
    pagination: PaginationInterface,
    manager?: EntityManager,
  ): Promise<PaginatedResult<EventReportDomainEntity>>;
}
