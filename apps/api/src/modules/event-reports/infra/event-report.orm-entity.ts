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
import { EventReportStatusEnum } from '../domain/event-report-status.enum';

@Entity('event_reports')
@Unique(['event', 'reporter'])
export class EventReportOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => EventsOrmEntity, (event) => event.reports, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'event_id' })
  event: EventsOrmEntity;

  @ManyToOne(() => PersonOrmEntity, (person) => person.reportsMade, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'reporter_id' })
  reporter: PersonOrmEntity;

  @Column({
    type: 'text',
    name: 'reason',
  })
  reason: string;

  @Column({
    type: 'enum',
    enum: EventReportStatusEnum,
    enumName: 'event_report_status_enum',
    name: 'status',
  })
  status: EventReportStatusEnum;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
