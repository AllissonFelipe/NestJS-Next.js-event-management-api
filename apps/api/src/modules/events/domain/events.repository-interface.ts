/* eslint-disable prettier/prettier */
import { EntityManager } from "typeorm";
import { EventsDomainEntity } from "./events.domain-entity";
import { EventsPaginatedResult } from "./events-paginated-result.interface";
import { FindEventFilters } from "../application/dto/find-event-filters.dto";

export const EVENTS_REPOSITORY = Symbol('EVENTS_REPOSITORY');

export interface EventsRepositoryInterface {
    createEvent(event: EventsDomainEntity, manager?: EntityManager): Promise<EventsDomainEntity>;
    deleteByOwnerAndId(ownerId: string, eventId: string, manager?: EntityManager): Promise<boolean>;
    findByOwnerAndId(ownerId: string, eventId: string, manager?: EntityManager): Promise<EventsDomainEntity | null>;
    findAllMyEventsWithFiltersByOwnerId(ownerId: string, filters: FindEventFilters, manager?: EntityManager): Promise<EventsPaginatedResult<EventsDomainEntity>>;
    saveEvent(event: EventsDomainEntity, manager?: EntityManager): Promise<EventsDomainEntity>;
    findAllPublicEventsWithFilters(filters: FindEventFilters, manager?: EntityManager): Promise<EventsPaginatedResult<EventsDomainEntity>>;
    findByEventId(eventId: string, manager?: EntityManager): Promise<EventsDomainEntity | null>;
    deleteEventById(eventId: string, manager?: EntityManager): Promise<boolean>;
    deleteByPersonIdAndEventId(personId: string, eventId: string, manager?: EntityManager): Promise<boolean>
}