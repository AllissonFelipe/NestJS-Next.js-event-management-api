import { EntityManager } from 'typeorm';
import { EventReportDomainEntity } from './event-report.domain-entity';

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
}
