import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PersonRoleEnum } from '../domain/person-role.enum';
import { PersonOrmEntity } from '../../person/infra/person.orm-entity';

@Entity('person_role')
export class PersonRoleOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PersonRoleEnum,
    unique: true,
  })
  role: PersonRoleEnum;

  @OneToMany(() => PersonOrmEntity, (person) => person.person_role)
  persons: PersonOrmEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
