/* eslint-disable prettier/prettier */
import { Inject, Injectable } from "@nestjs/common";
import { EnsureUserExists } from "../validator/ensure-user-exists.validator";
import { UserPersonIdNotFoundError } from "../../domain/errors/user-person-id-not-found.error";
import { EVENTS_REPOSITORY, type EventsRepositoryInterface } from "src/modules/events/domain/events.repository-interface";
import { FindEventFilters } from "src/modules/events/application/dto/find-event-filters.dto";
import { EventPaginationReponseDto, EventResponseDto } from "../response/event/event-response.dto";
import { EventPaginationResponseMapper, EventResponseMapper } from "../response/event/event-response-mapper";
import { EventNotFoundError } from "src/modules/events/domain/errors/event-not-found-error";
import { EventAddressNotFoundError } from "src/modules/events/domain/errors/event-address-not-found.error";
import { EventsStatusEnum } from "src/modules/events/domain/events-status.enum";

@Injectable()
export class UserFindEventsUseCase {
    constructor (
        @Inject(EVENTS_REPOSITORY)
        private readonly eventsRepository: EventsRepositoryInterface,
        @Inject()
        private readonly ensureUserExist: EnsureUserExists,
    ) {}

    async findAll(userPersonId: string, filter: FindEventFilters): Promise<EventPaginationReponseDto> {
        if (!userPersonId) {
            throw new UserPersonIdNotFoundError();
        }
        
        await this.ensureUserExist.ensureUserExistsByPersonId(userPersonId)
        
        const { items, total } = await this.eventsRepository.findAllMyEventsWithFiltersByOwnerId(userPersonId, filter);

        const page = filter.page ?? 1;
        const limit = filter.limit ?? 10;

        items.map((event) => {
            if (event.status === EventsStatusEnum.APPROVED) {
                const now = new Date()
                event.updateStatus(this.resolveCurrentStatus(event.startAt, event.endAt, now))
            }
        })

        return EventPaginationResponseMapper.toResponse(items, page, limit, total);
    }

    async findOneEventByUserAndEventId(userPersonId: string, eventId: string): Promise<EventResponseDto> {
        if (!userPersonId) {
            throw new UserPersonIdNotFoundError();
        }
        await this.ensureUserExist.ensureUserExistsByPersonId(userPersonId);

        const event = await this.eventsRepository.findByOwnerAndId(userPersonId, eventId);

        if (!event) {
            throw new EventNotFoundError();
        }
        if (!event.address) {
            throw new EventAddressNotFoundError();
        }
        if (event.status === EventsStatusEnum.APPROVED) {
            event.updateStatus(this.resolveCurrentStatus(event.startAt, event.endAt, new Date()))
        }
        
        return EventResponseMapper.toResponse(event);
    }

    private resolveCurrentStatus(startAt: Date, endAt: Date, now: Date): EventsStatusEnum {
        if (startAt > now) return EventsStatusEnum.UPCOMING;
        if (endAt < now) return EventsStatusEnum.CONCLUDED;
        return EventsStatusEnum.IN_PROGRESS;
    }
}