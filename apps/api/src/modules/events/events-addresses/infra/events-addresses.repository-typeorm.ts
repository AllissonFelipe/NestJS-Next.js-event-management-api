/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventsAddressesOrmEntity } from "./events-addresses.orm-entity";
import { EntityManager, Repository } from "typeorm";
import { EventsAddressesRepositoryInterface } from "../domain/events-addresses.repository-interface";
import { EventsAddressDomainEntity } from "../domain/events-addresses.domain-entity";
import { EventsAddressMapper } from "./events-addresses.mapper";

@Injectable()
export class EventsAddressesRepositoryTypeOrm implements EventsAddressesRepositoryInterface {
    constructor (
        @InjectRepository(EventsAddressesOrmEntity)
        private readonly eventAddressRepository: Repository<EventsAddressesOrmEntity>,
    ) {}
    
    private getRepository(manager?: EntityManager): Repository<EventsAddressesOrmEntity> {
        return manager ? manager.getRepository(EventsAddressesOrmEntity) : this.eventAddressRepository; 
    }

    async createEventAddress(eventAddress: EventsAddressDomainEntity, manager?: EntityManager): Promise<EventsAddressDomainEntity> {
        const repository = this.getRepository(manager);
        const eventAddressOrm = EventsAddressMapper.toOrm(eventAddress);
        const saved = await repository.save(eventAddressOrm);
        return EventsAddressMapper.toDomain(saved);
    }

    async findByEventId(eventId: string, manager?: EntityManager): Promise<EventsAddressDomainEntity | null> {
        const repository = this.getRepository(manager);
        const eventAddressOrm = await repository.findOne({
            where: { 
                event: { id: eventId }, 
            },
            relations: ['event']
        });
        if (!eventAddressOrm) return null;
        return EventsAddressMapper.toDomain(eventAddressOrm);
    }

    async updateEventAddress(eventAddress: EventsAddressDomainEntity, manager?: EntityManager): Promise<EventsAddressDomainEntity> {
        const repository = this.getRepository(manager);
        const eventAddressOrm = EventsAddressMapper.toOrm(eventAddress);
        const saved = await repository.save(eventAddressOrm);
        return EventsAddressMapper.toDomain(saved);
    }
    
}