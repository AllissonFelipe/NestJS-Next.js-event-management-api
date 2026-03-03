import { PersonOrmEntity } from '../../person/infra/person.orm-entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('email_change_token')
export class EmailChangeTokenOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PersonOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'person_id' })
  person_id: PersonOrmEntity;

  @Column({ name: 'token' })
  token: string;

  @Column({ name: 'new_email', type: 'varchar', nullable: false })
  new_email: string;

  @Column({ name: 'expires_at' })
  expires_at: Date;

  @Column({ name: 'used_at', type: 'timestamptz', nullable: true })
  used_at: Date | null;
}
