/* eslint-disable prettier/prettier */
import { UserUpdateEventDto } from "../dtos/update-event.dto";
import { EventResponseDto } from "../response/event/event-response.dto";
import { UserPersonIdNotFoundError } from "../../domain/errors/user-person-id-not-found.error";
import { EnsureUserExists } from "../validator/ensure-user-exists.validator";
import { Inject, Injectable } from "@nestjs/common";
import { EVENTS_REPOSITORY, type EventsRepositoryInterface } from "src/modules/events/domain/events.repository-interface";
import { EventNotFoundError } from "src/modules/events/domain/errors/event-not-found-error";
import { EmptyUpdatePayloadError } from "src/shared/errors/empty-update-payload.error";
import { EventAddressNotFoundError } from "src/modules/events/domain/errors/event-address-not-found.error";
import { UNIT_OF_WORK, type UnitOfWorkInterface } from "src/database/unit-of-work.interface";
import { EVENTS_ADDRESSES_REPOSITORY, type EventsAddressesRepositoryInterface } from "src/modules/events/events-addresses/domain/events-addresses.repository-interface";
import { EventResponseMapper } from "../response/event/event-response-mapper";

@Injectable()
export class UserUpdateEventUseCase {
    constructor (
        @Inject()
        private readonly ensureUserExist: EnsureUserExists,
        @Inject(EVENTS_REPOSITORY)
        private readonly eventsRepository: EventsRepositoryInterface,
        @Inject(EVENTS_ADDRESSES_REPOSITORY)
        private readonly eventsAddressRepository: EventsAddressesRepositoryInterface,
        @Inject(UNIT_OF_WORK)
        private readonly uow: UnitOfWorkInterface,
    ) {}

    async execute(userPersonId: string, eventId: string, dto: UserUpdateEventDto): Promise<EventResponseDto> {
        if (!userPersonId) {
            throw new UserPersonIdNotFoundError();
        }

        const hasEventUpdate = dto.event && Object.keys(dto.event).length > 0;
        const hasAddressUpdate = dto.eventAddress && Object.keys(dto.eventAddress).length > 0
        
        if(!hasEventUpdate && !hasAddressUpdate) {
            throw new EmptyUpdatePayloadError();
        }

        const user = await this.ensureUserExist.ensureUserExistsByPersonId(userPersonId);

        const event = await this.eventsRepository.findByOwnerAndId(user.id, eventId);
        if (!event) {
            throw new EventNotFoundError();
        }
        if (!event.address) {
            throw new EventAddressNotFoundError();
        }
        
        await this.uow.execute(async (manager) => {
            if (dto.eventAddress && Object.keys(dto.eventAddress).length > 0) {
                event.address.updateAddress(dto.eventAddress);
            }
            if (dto.event && Object.keys(dto.event).length > 0) {
                event.updateEvent(dto.event);
            }
            await this.eventsRepository.saveEvent(event, manager)
        })
        
        return EventResponseMapper.toResponse(event);
    }
}