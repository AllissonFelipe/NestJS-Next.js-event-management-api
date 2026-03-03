/* eslint-disable prettier/prettier */
import { PersonOrmEntity } from "../../person/infra/person.orm-entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('password_reset_token')
export class PasswordResetTokenOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => PersonOrmEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'person_id' })
    person_id: PersonOrmEntity;

    @Column()
    token: string;

    @Column()
    expires_at: Date;

    @Column({ type: 'timestamptz', nullable: true })
    used_at: Date | null;

}
