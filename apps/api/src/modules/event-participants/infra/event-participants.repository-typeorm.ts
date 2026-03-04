import { EntityManager, Repository } from 'typeorm';
import { EventParticipantsDomainEntity } from '../domain/event-participants.domain-entity';
import { EventParticipantsRepositoryInterface } from '../domain/event-participants.repository-interface';
import { InjectRepository } from '@nestjs/typeorm';
import { EventParticipantsOrmEntity } from './event-participants.orm-entity';
import { EventParticipantMapper } from './event-participants.mapper';
import { EventsDomainEntity } from 'src/modules/events/domain/events.domain-entity';
import { PersonDomainEntity } from 'src/modules/person/domain/person.domain-entity';

export class EventParticipantsRepositoryTypeOrm implements EventParticipantsRepositoryInterface {
  constructor(
    @InjectRepository(EventParticipantsOrmEntity)
    private readonly eventParticipantsRepository: Repository<EventParticipantsOrmEntity>,
  ) {}

  private getRepository(
    manager?: EntityManager,
  ): Repository<EventParticipantsOrmEntity> {
    return manager
      ? manager.getRepository(EventParticipantsOrmEntity)
      : this.eventParticipantsRepository;
  }

  async persist(
    domainEntity: EventParticipantsDomainEntity,
    manager?: EntityManager,
  ): Promise<EventParticipantsDomainEntity> {
    const repository = this.getRepository(manager);
    await repository
      .createQueryBuilder()
      .insert()
      .into(EventParticipantsOrmEntity)
      .values({
        event: { id: domainEntity.event.id },
        person: { id: domainEntity.person.id },
        status: domainEntity.status,
      })
      .orUpdate(['status'], ['event_id', 'person_id'])
      .execute();
    const updatedOrmEntity = await repository.findOne({
      where: {
        event: { id: domainEntity.event.id },
        person: { id: domainEntity.person.id },
      },
      relations: {
        event: true,
        person: {
          person_role: true,
          person_profile: true, // se o mapper precisa
        },
      },
    });
    if (!updatedOrmEntity) {
      throw new Error('EventParticipant not found after upsert');
    }
    return EventParticipantMapper.toDomain(
      updatedOrmEntity,
      domainEntity.event,
    );
  }

  async findWithPersonIdAndEventId(
    person: PersonDomainEntity,
    event: EventsDomainEntity,
    manager?: EntityManager,
  ): Promise<EventParticipantsDomainEntity | null> {
    const repository = this.getRepository(manager);
    const ormEntity = await repository.findOne({
      where: { event: { id: event.id }, person: { id: person.id } },
      relations: {
        person: {
          person_role: true,
          person_profile: true, // se o mapper precisa
        },
        event: true,
      },
    });
    if (!ormEntity) return null;
    return EventParticipantMapper.toDomain(ormEntity, event);
  }

  async deleteParticipationOfUser(eventParticipantsId: string, manager?: EntityManager): Promise<void> {
    const repository = this.getRepository(manager);
    await repository.delete(eventParticipantsId);
  }

}
