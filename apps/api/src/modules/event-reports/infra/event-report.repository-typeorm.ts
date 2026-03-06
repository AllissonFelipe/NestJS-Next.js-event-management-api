import { EntityManager, Repository } from 'typeorm';
import { EventReportDomainEntity } from '../domain/event-report.domain-entity';
import { EventReportRepositoryInterface } from '../domain/event-report.repository-interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventReportOrmEntity } from './event-report.orm-entity';
import { EventReportMapper } from './event-report.mapper';
import { PaginatedResult } from 'src/modules/events/domain/paginated-result.interface';
import { MyEventReportsQueryDto } from 'src/modules/events/application/dto/my-event-reports-query.dto';
import { PaginationInterface } from '../domain/pagination.interface';
import { FindEventReportQueryDto } from 'src/modules/admin/application/dtos/find-event-report-query.dto';
import { AdminPaginatedResultInterface } from 'src/modules/admin/domain/paginated-result.interface';
import { AdminPaginationInterface } from 'src/modules/admin/domain/pagination.interface';

@Injectable()
export class EventReportRepositoryTypeOrm implements EventReportRepositoryInterface {
  constructor(
    @InjectRepository(EventReportOrmEntity)
    private readonly eventReportRepository: Repository<EventReportOrmEntity>,
  ) {}

  private getRepository(
    manager?: EntityManager,
  ): Repository<EventReportOrmEntity> {
    return manager
      ? manager.getRepository(EventReportOrmEntity)
      : this.eventReportRepository;
  }

  async findByPersonIdAndEventId(
    personId: string,
    eventId: string,
    manager?: EntityManager,
  ): Promise<EventReportDomainEntity | null> {
    const repository = this.getRepository(manager);
    const ormEntity = await repository.findOne({
      where: { event: { id: eventId }, reporter: { id: personId } },
      relations: {
        event: {
          created_by: {
            person_role: true,
            person_profile: true,
          },
        },
        reporter: {
          person_role: true,
          person_profile: true,
        },
      },
    });
    if (!ormEntity) return null;
    return EventReportMapper.toDomain(ormEntity);
  }

  async persist(
    eventReportDomain: EventReportDomainEntity,
    manager?: EntityManager,
  ): Promise<EventReportDomainEntity> {
    const repository = this.getRepository(manager);
    const orm = EventReportMapper.toOrm(eventReportDomain);
    const saved = await repository.save(orm);
    return EventReportMapper.toDomain(saved);
  }

  async findAllMyEventsReports(
    userPersonId: string,
    query: MyEventReportsQueryDto,
    pagination: PaginationInterface,
    manager?: EntityManager,
  ): Promise<PaginatedResult<EventReportDomainEntity>> {
    const repository = this.getRepository(manager);
    const qb = repository.createQueryBuilder('eventReports');
    qb.leftJoinAndSelect('eventReports.event', 'event');
    qb.leftJoinAndSelect('event.event_address', 'eventAddress');
    qb.leftJoinAndSelect('eventReports.reporter', 'reporter');
    qb.leftJoinAndSelect('reporter.person_role', 'reporterPersonRole');
    qb.leftJoinAndSelect('reporter.person_profile', 'reporterPersonProfile');
    qb.leftJoinAndSelect('event.created_by', 'eventCreatedBy');
    qb.leftJoinAndSelect('eventCreatedBy.person_role', 'personRole');
    qb.leftJoinAndSelect('eventCreatedBy.person_profile', 'personProfile');
    qb.where('reporter.id = :userPersonId', { userPersonId });

    // VERIFICAÇÃO DE QUERIES
    if (query.reason) {
      qb.andWhere('eventReports.reason ILIKE :reason', {
        reason: `%${query.reason}%`,
      });
    }
    if (query.status) {
      qb.andWhere('eventReports.status = :status', {
        status: query.status,
      });
    }
    if (query.createdAt) {
      qb.andWhere('eventReports.created_at >= :createdAt', {
        createdAt: new Date(query.createdAt),
      });
    }

    // PAGINAÇÃO
    qb.skip((pagination.page - 1) * pagination.limit).take(pagination.limit);
    // RESULTADO
    const [result, total] = await qb.getManyAndCount();
    // RETORNANDO RESULTADO
    return {
      items: result.map((eventReport) =>
        EventReportMapper.toDomain(eventReport),
      ),
      total,
    };
  }

  async findAllOfEvent(
    eventId: string,
    query: FindEventReportQueryDto,
    pagination: AdminPaginationInterface,
    manager?: EntityManager,
  ): Promise<AdminPaginatedResultInterface<EventReportDomainEntity>> {
    const repository = this.getRepository(manager);
    const qb = repository.createQueryBuilder('eventReports');
    qb.leftJoinAndSelect('eventReports.event', 'event');
    qb.leftJoinAndSelect('event.event_address', 'address');
    qb.leftJoinAndSelect('eventReports.reporter', 'reporter');
    qb.leftJoinAndSelect('reporter.person_role', 'reporterPersonRole');
    qb.leftJoinAndSelect('reporter.person_profile', 'reporterPersonProfile');
    qb.leftJoinAndSelect('event.created_by', 'eventCreatedBy');
    qb.leftJoinAndSelect('eventCreatedBy.person_role', 'createByPersonRole');
    qb.leftJoinAndSelect(
      'eventCreatedBy.person_profile',
      'createdByPersonProfile',
    );
    qb.where('event.id = :eventId', { eventId });

    if (query.reason) {
      qb.andWhere('eventReports.reason ILIKE :reason', {
        reason: `%${query.reason}%`,
      });
    }
    if (query.status) {
      qb.andWhere('eventReports.status = :status', { status: query.status });
    }
    if (query.createdAt) {
      qb.andWhere('eventReports.created_at >= :createdAt', {
        createdAt: query.createdAt,
      });
    }

    qb.skip((pagination.page - 1) * pagination.limit).take(pagination.limit);

    const [items, total] = await qb.getManyAndCount();

    const result = {
      items: items.map((eventReport) =>
        EventReportMapper.toDomain(eventReport),
      ),
      total,
    };

    return result;
  }
}
