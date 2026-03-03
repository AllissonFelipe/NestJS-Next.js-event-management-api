import { Injectable } from '@nestjs/common';
import { EventsRepositoryInterface } from '../domain/events.repository-interface';
import { EntityManager, Repository } from 'typeorm';
import { EventsDomainEntity } from '../domain/events.domain-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventsOrmEntity } from './events.orm-entity';
import { EventsMapper } from './events.mapper';
import { FindEventFilters } from '../application/dto/find-event-filters.dto';
import { EventsPaginatedResult } from '../domain/events-paginated-result.interface';

@Injectable()
export class EventsRepositoryTypeOrm implements EventsRepositoryInterface {
  constructor(
    @InjectRepository(EventsOrmEntity)
    private readonly eventsRepository: Repository<EventsOrmEntity>,
  ) {}

  private getRepository(manager?: EntityManager): Repository<EventsOrmEntity> {
    return manager
      ? manager.getRepository(EventsOrmEntity)
      : this.eventsRepository;
  }

  async deleteEventById(
    eventId: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    const repository = this.getRepository(manager);
    const result = await repository.delete(eventId);
    if (result.affected && result.affected > 0) {
      return true;
    }
    return false;
  }

  async deleteByPersonIdAndEventId(
    personId: string,
    eventId: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    const repository = this.getRepository(manager);
    const result = await repository.delete({
      created_by: { id: personId },
      id: eventId,
    });
    if (result.affected && result.affected > 0) {
      return true;
    }
    return false;
  }

  async findByEventId(
    eventId: string,
    manager?: EntityManager,
  ): Promise<EventsDomainEntity | null> {
    const repository = this.getRepository(manager);
    const eventOrm = await repository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.created_by', 'created_by')
      .leftJoinAndSelect('created_by.person_role', 'person_role')
      .leftJoinAndSelect('created_by.person_profile', 'person_profile')
      .leftJoinAndSelect('event.event_address', 'event_address')
      .leftJoinAndSelect('event.participants', 'participants')
      .leftJoinAndSelect('participants.person', 'person')
      .leftJoinAndSelect('person.person_role', 'participantPersonRole')
      .leftJoinAndSelect('person.person_profile', 'participantPersonProfile')
      .where('event.id = :eventId', { eventId })
      .getOne();
    if (!eventOrm) return null;
    return EventsMapper.toDomain(eventOrm);
  }

  async saveEvent(
    event: EventsDomainEntity,
    manager?: EntityManager,
  ): Promise<EventsDomainEntity> {
    const repository = this.getRepository(manager);
    const eventOrm = EventsMapper.toOrm(event);
    const saved = await repository.save(eventOrm);
    const reload = await repository.findOne({
      where: { id: saved.id },
      relations: [
        'created_by',
        'created_by.person_role',
        'created_by.person_profile',
        'event_address',
        'participants',
        'participants.person',
      ],
    });
    if (!reload) {
      throw new Error(``);
    }
    return EventsMapper.toDomain(reload);
  }

  async createEvent(
    event: EventsDomainEntity,
    manager?: EntityManager,
  ): Promise<EventsDomainEntity> {
    const repository = this.getRepository(manager);
    const eventOrm = EventsMapper.toOrm(event);
    await repository.save(eventOrm);
    return event;
  }

  async findByOwnerAndId(
    ownerId: string,
    eventId: string,
    manager?: EntityManager,
  ): Promise<EventsDomainEntity | null> {
    const repository = this.getRepository(manager);
    const eventOrm = await repository.findOne({
      where: {
        id: eventId,
        created_by: { id: ownerId },
      },
      relations: [
        'created_by',
        'created_by.person_role',
        'created_by.person_profile',
        'event_address',
        'participants',
        'participants.person',
        'participants.person.person_role',
        'participants.person.person_profile',
      ],
    });
    if (!eventOrm) return null;
    return EventsMapper.toDomain(eventOrm);
  }

  async findAllMyEventsWithFiltersByOwnerId(
    ownerId: string,
    filters: FindEventFilters,
    manager?: EntityManager,
  ): Promise<EventsPaginatedResult<EventsDomainEntity>> {
    const repository = this.getRepository(manager);
    const qb = repository.createQueryBuilder('events');
    qb.leftJoinAndSelect('events.event_address', 'address');
    qb.leftJoinAndSelect('events.created_by', 'createdBy');
    qb.leftJoinAndSelect('createdBy.person_role', 'personRole');
    qb.leftJoinAndSelect('createdBy.person_profile', 'personProfile');
    qb.leftJoinAndSelect('events.participants', 'participants');
    qb.leftJoinAndSelect('participants.person', 'participantPerson');
    qb.leftJoinAndSelect(
      'participantPerson.person_role',
      'participantPersonRole',
    );
    qb.leftJoinAndSelect(
      'participantPerson.person_profile',
      'participantPersonProfile',
    );
    // FILTROS
    if (filters.title) {
      qb.andWhere(`events.title ILIKE :title`, { title: `%${filters.title}%` });
    }
    if (filters.city) {
      qb.andWhere('address.city ILIKE :city', { city: `%${filters.city}%` });
    }
    if (filters.startAt) {
      qb.andWhere('events.end_at >= :startAt', { startAt: filters.startAt });
    }
    if (filters.endAt) {
      qb.andWhere('events.start_at <= :endAt', { endAt: filters.endAt });
    }
    if (filters.status) {
      qb.andWhere('events.status = :status', { status: filters.status });
    }
    // SOMENTE EVENTOS DO USUÁRIO
    qb.andWhere('events.created_by = :ownerId', { ownerId: ownerId });

    // PAGINAÇÃO
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    qb.skip((page - 1) * limit).take(limit);
    const [result, total] = await qb.getManyAndCount();
    return {
      items: result.map((event) => EventsMapper.toDomain(event)),
      total,
    };
  }

  async findAllPublicEventsWithFilters(
    filters: FindEventFilters,
    manager?: EntityManager,
  ): Promise<EventsPaginatedResult<EventsDomainEntity>> {
    const repository = this.getRepository(manager);
    const qb = repository.createQueryBuilder('events');
    qb.leftJoinAndSelect('events.event_address', 'address');
    qb.leftJoinAndSelect('events.created_by', 'createdBy');
    qb.leftJoinAndSelect('createdBy.person_role', 'personRole');
    qb.leftJoinAndSelect('createdBy.person_profile', 'personProfile');
    qb.leftJoinAndSelect('events.participants', 'participants');
    qb.leftJoinAndSelect('participants.person', 'participantPerson');
    qb.leftJoinAndSelect(
      'participantPerson.person_role',
      'participantPersonRole',
    );
    qb.leftJoinAndSelect(
      'participantPerson.person_profile',
      'participantPersonProfile',
    );
    // FILTROS
    if (filters.title) {
      qb.andWhere(`events.title ILIKE :title`, { title: `%${filters.title}%` });
    }
    if (filters.city) {
      qb.andWhere('address.city ILIKE :city', { city: `%${filters.city}%` });
    }
    if (filters.startAt) {
      qb.andWhere('events.end_at >= :startAt', { startAt: filters.startAt });
    }
    if (filters.endAt) {
      qb.andWhere('events.start_at <= :endAt', { endAt: filters.endAt });
    }
    if (filters.status) {
      qb.andWhere('events.status = :status', { status: filters.status });
    }
    // PAGINAÇÃO
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    qb.skip((page - 1) * limit).take(limit);
    const [result, total] = await qb.getManyAndCount();
    return {
      items: result.map((event) => EventsMapper.toDomain(event)),
      total,
    };
  }

  async deleteByOwnerAndId(
    ownerId: string,
    eventId: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    const repository = this.getRepository(manager);
    const result = await repository.delete({
      created_by: { id: ownerId },
      id: eventId,
    });
    if (result.affected && result.affected > 0) {
      return true;
    }
    return false;
  }
}
