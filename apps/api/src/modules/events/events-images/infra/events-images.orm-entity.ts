import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventsOrmEntity } from '../../infra/events.orm-entity';

@Entity('events_images')
export class EventsImagesOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'image_url' })
  image_url: string;

  @CreateDateColumn()
  created_at: Date;

  @Index('IDX_EVENTS_IMAGES_EVENT_ID')
  @ManyToOne(() => EventsOrmEntity, (event) => event.event_images, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'event_id' })
  event: EventsOrmEntity;
}
