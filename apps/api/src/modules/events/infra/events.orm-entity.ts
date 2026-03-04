import { PersonOrmEntity } from '../../person/infra/person.orm-entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventsStatusEnum } from '../domain/events-status.enum';
import { EventsImagesOrmEntity } from '../events-images/infra/events-images.orm-entity';
import { EventsAddressesOrmEntity } from '../events-addresses/infra/events-addresses.orm-entity';
import { EventParticipantsOrmEntity } from '../../event-participants/infra/event-participants.orm-entity';
import { EventReportOrmEntity } from '../../event-reports/infra/event-report.orm-entity';

@Entity('events')
export class EventsOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'title', nullable: false })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'start_at', nullable: false })
  start_at: Date;

  @Column({ name: 'end_at', nullable: false })
  end_at: Date;

  @ManyToOne(() => PersonOrmEntity, (person) => person.events, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by' })
  created_by: PersonOrmEntity;

  @Index('IDX_EVENTS_STATUS')
  @Column({
    type: 'enum',
    enum: EventsStatusEnum,
    name: 'status',
  })
  status: EventsStatusEnum;

  @OneToOne(() => EventsAddressesOrmEntity, (address) => address.event, {
    cascade: true,
    eager: true,
    nullable: false,
  })
  event_address: EventsAddressesOrmEntity;

  @OneToMany(() => EventsImagesOrmEntity, (eventImages) => eventImages.event)
  event_images: EventsImagesOrmEntity[];

  @OneToMany(
    () => EventParticipantsOrmEntity,
    (participant) => participant.event,
  )
  participants: EventParticipantsOrmEntity[];

  @OneToMany(() => EventReportOrmEntity, (reports) => reports.event)
  reports: EventReportOrmEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
