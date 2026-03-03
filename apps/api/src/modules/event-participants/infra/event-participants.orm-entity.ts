import { EventsOrmEntity } from '../../events/infra/events.orm-entity';
import { PersonOrmEntity } from '../../person/infra/person.orm-entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { EventParticipantStatusEnum } from '../domain/event-participants.status-enum';

@Entity('event_participants')
@Unique(['event', 'person'])
export class EventParticipantsOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => EventsOrmEntity, (event) => event.participants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: EventsOrmEntity;

  @ManyToOne(() => PersonOrmEntity, (person) => person.participations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'person_id' })
  person: PersonOrmEntity;

  @Column({
    type: 'enum',
    enum: EventParticipantStatusEnum,
    name: 'status',
  })
  status: EventParticipantStatusEnum;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
