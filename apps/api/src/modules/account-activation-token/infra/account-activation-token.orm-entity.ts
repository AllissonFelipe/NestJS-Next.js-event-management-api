/* eslint-disable prettier/prettier */
import { PersonOrmEntity } from "../../person/infra/person.orm-entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('account_activation_token')
export class AccountActivationTokenOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => PersonOrmEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'person_id'})
    person_id: PersonOrmEntity;
    
    @Column()
    token: string;

    @Column()
    expires_at: Date;

    @Column({ type: 'timestamptz', nullable: true })
    used_at: Date | null;

}