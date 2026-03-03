/* eslint-disable prettier/prettier */
import { PersonOrmEntity } from "../../person/infra/person.orm-entity";
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('person_profile')
export class PersonProfileOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ name: 'avatar_url', nullable: true })
    avatar_url?: string;

    @Column({ name: 'bio', type: 'text', nullable: true })
    bio?: string;

    @Column({ name: 'phone', nullable: true })
    phone?: string;

    @Column({ name: 'birth_date', nullable: true })
    birth_date?: Date;

    @OneToOne(() => PersonOrmEntity, (person) => person.person_profile)
    person: PersonOrmEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}