/* eslint-disable prettier/prettier */
import { EntityManager } from "typeorm";
import { EventsAddressDomainEntity } from "./events-addresses.domain-entity";

export const EVENTS_ADDRESSES_REPOSITORY = Symbol('EVENTS_ADDRESSES_REPOSITORY');

export interface EventsAddressesRepositoryInterface {
    createEventAddress(eventAddress: EventsAddressDomainEntity, manager?: EntityManager): Promise<EventsAddressDomainEntity>;
    findByEventId(eventId: string, manager?: EntityManager): Promise<EventsAddressDomainEntity | null>;
    updateEventAddress(eventAddress: EventsAddressDomainEntity, manager?: EntityManager): Promise<EventsAddressDomainEntity>;
}