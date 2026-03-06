import { EntityManager } from 'typeorm';
import { EventReportDomainEntity } from './event-report.domain-entity';
import { PaginatedResult } from 'src/modules/events/domain/paginated-result.interface';
import { MyEventReportsQueryDto } from 'src/modules/events/application/dto/my-event-reports-query.dto';
import { PaginationInterface } from './pagination.interface';
import { FindEventReportQueryDto } from 'src/modules/admin/application/dtos/find-event-report-query.dto';
import { AdminPaginatedResultInterface } from 'src/modules/admin/domain/paginated-result.interface';
import { AdminPaginationInterface } from 'src/modules/admin/domain/pagination.interface';

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
  findAllOfEvent(
    eventId: string,
    query: FindEventReportQueryDto,
    pagination: AdminPaginationInterface,
    manager?: EntityManager,
  ): Promise<AdminPaginatedResultInterface<EventReportDomainEntity>>;
}
