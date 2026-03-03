import { EventParticipantsOrmEntity } from '../../event-participants/infra/event-participants.orm-entity';
import { EventsOrmEntity } from '../../events/infra/events.orm-entity';
import { PersonProfileOrmEntity } from '../../person-profile/infra/person-profile.orm-entity';
import { PersonRoleOrmEntity } from '../../person-role/infra/person-role.orm-entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('person')
export class PersonOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  full_name: string;

  @Column({ unique: true })
  cpf: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ default: false })
  is_active: boolean;

  @ManyToOne(() => PersonRoleOrmEntity, (role) => role.persons, {
    nullable: false,
  })
  @JoinColumn({ name: 'person_role_id' })
  person_role: PersonRoleOrmEntity;

  @OneToOne(() => PersonProfileOrmEntity, (profile) => profile.person, {
    nullable: false,
  })
  @JoinColumn({ name: 'person_profile_id' })
  person_profile: PersonProfileOrmEntity;

  @OneToMany(() => EventsOrmEntity, (events) => events.created_by)
  events: EventsOrmEntity[];

  @OneToMany(
    () => EventParticipantsOrmEntity,
    (participation) => participation.person,
  )
  participations: EventParticipantsOrmEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
