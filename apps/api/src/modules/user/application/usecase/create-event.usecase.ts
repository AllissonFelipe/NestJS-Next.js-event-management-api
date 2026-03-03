/* eslint-disable prettier/prettier */
import { Inject, Injectable } from "@nestjs/common";
import { UserCreateEventDto } from "../dtos/create-event.dto";
import { UserPersonIdNotFoundError } from "../../domain/errors/user-person-id-not-found.error";
import { UserNotFoundError } from "../../domain/errors/user-not-found.error";
import { EnsureUserExists } from "../validator/ensure-user-exists.validator";
import { EventsDomainEntity } from "src/modules/events/domain/events.domain-entity";
import { UNIT_OF_WORK } from "src/database/unit-of-work.interface";
import { TypeOrmUnitOfWork } from "src/database/typeorm-unit-of-work";
import { EVENTS_REPOSITORY, type EventsRepositoryInterface } from "src/modules/events/domain/events.repository-interface";
import { EventsAddressDomainEntity } from "src/modules/events/events-addresses/domain/events-addresses.domain-entity";
import { EVENTS_ADDRESSES_REPOSITORY, type EventsAddressesRepositoryInterface } from "src/modules/events/events-addresses/domain/events-addresses.repository-interface";
import { EventResponseMapper } from "../response/event/event-response-mapper";
import { EventResponseDto } from "../response/event/event-response.dto";


@Injectable()
export class UserCreateEventUseCase {
    constructor (
        @Inject(UNIT_OF_WORK)
        private readonly uow: TypeOrmUnitOfWork,
        @Inject(EVENTS_REPOSITORY)
        private readonly eventsRepository: EventsRepositoryInterface,
        @Inject(EVENTS_ADDRESSES_REPOSITORY)
        private readonly eventsAddressRepository: EventsAddressesRepositoryInterface,
        @Inject()
        private readonly ensureUserExist: EnsureUserExists,
    ) {}

    async execute(userPersonId: string, dto: UserCreateEventDto): Promise<EventResponseDto> {
        if (!userPersonId) {
            throw new UserPersonIdNotFoundError();
        }
        const user = await this.ensureUserExist.ensureUserExistsByPersonId(userPersonId);
        if (!user) {
            throw new UserNotFoundError();
        }
        const event = await this.uow.execute(async (manager) => {
            
            const eventAddressDomain = EventsAddressDomainEntity.create({
                street: dto.eventAddress.street,
                number: dto.eventAddress.number,
                complement: dto.eventAddress.complement,
                neighborhood: dto.eventAddress.neighborhood,
                city: dto.eventAddress.city,
                state: dto.eventAddress.state,
                zipCode: dto.eventAddress.zipCode,
            })

            const eventDomain = EventsDomainEntity.create({
                title: dto.title,
                description: dto.description,
                startAt: dto.startAt,
                endAt: dto.endAt,
                address: eventAddressDomain,
                createdBy: user,
            })
            return await this.eventsRepository.createEvent(eventDomain, manager);
        });
        return EventResponseMapper.toResponse(event)
    }
}