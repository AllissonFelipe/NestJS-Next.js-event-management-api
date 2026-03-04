import { EntityManager, Repository } from 'typeorm';
import { EventReportDomainEntity } from '../domain/event-report.domain-entity';
import { EventReportRepositoryInterface } from '../domain/event-report.repository-interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventReportOrmEntity } from './event-report.orm-entity';
import { EventReportMapper } from './event-report.mapper';

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
}
