/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EventsOrmEntity } from "../../infra/events.orm-entity";

@Entity('events_addresses')
export class EventsAddressesOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'street' })
    street: string;

    @Column({ name: 'number' })
    number: string;

    @Column({ name: 'complement', nullable: true })
    complement?: string;

    @Column({ name: 'neighborhood' })
    neighborhood: string;

    @Column({ name: 'city' })
    city: string;

    @Column({ name: 'state' })
    state: string;

    @Column({ name: 'zip_code' })
    zip_code: string;

    @OneToOne(() => EventsOrmEntity, (event) => event.event_address, { nullable: false, onDelete: 'CASCADE' })
    @Index({ unique: true })
    @JoinColumn({ name: 'event_id' })
    event: EventsOrmEntity;

    @CreateDateColumn()
    created_at: Date;
    
    @UpdateDateColumn()
    updated_at: Date;
}