/* eslint-disable prettier/prettier */
import { Inject, Injectable } from "@nestjs/common";
import { AdminIdNotFoundError } from "../../domain/errors/admin-id-not-found.error";
import { IsAdminValidator } from "../validators/is-admin.validator";
import { PERSON_REPOSITORY, type PersonRepositoryInterface } from "src/modules/person/domain/person.repository-interface";
import { UserNotFoundError } from "src/shared/errors/user-not-found.error";
import { EVENTS_REPOSITORY, type EventsRepositoryInterface } from "src/modules/events/domain/events.repository-interface";
import { EventIdNotFoundError } from "../../domain/errors/admin-event-id-not-found.error";
import { UserPersonIdNotFoundError } from "../../domain/errors/admin-user-person-id-not-found.error";
import { EventNotFoundError } from "../../domain/errors/admin-event-not-found.error";
import { EventPresenter } from "../response/event/event-presenter";
import { EventAddressNotFoundError } from "src/modules/events/domain/errors/event-address-not-found.error";
import { EventResponseDto, EventResponseWithPaginationDto } from "../response/event/event-response.dto";
import { FindEventFilters } from "src/modules/events/application/dto/find-event-filters.dto";
import { EventsStatusEnum } from "src/modules/events/domain/events-status.enum";

@Injectable()
export class FindEventsUseCase {
    constructor (
        @Inject(PERSON_REPOSITORY)
        private readonly personRepository: PersonRepositoryInterface,
        @Inject()
        private readonly isAdminValidator: IsAdminValidator,
        @Inject(EVENTS_REPOSITORY)
        private readonly eventsRepository: EventsRepositoryInterface,
    ) {}

    // ACHAR UM EVENTO DO USER byUserPersonId && byEventId
    async byUserIdAndEventId(adminPersonId: string, userPersonId: string, eventId: string): Promise<EventResponseDto> {
        if (!adminPersonId) {
            throw new AdminIdNotFoundError();
        }
        if (!userPersonId) {
            throw new UserPersonIdNotFoundError();
        }
        if (!eventId) {
            throw new EventIdNotFoundError();
        }
        await this.isAdminValidator.validate(adminPersonId);
        const user = await this.personRepository.findPersonById(userPersonId);
        if (!user) {
            throw new UserNotFoundError();
        }
        const userEvent = await this.eventsRepository.findByOwnerAndId(user.id, eventId)
        if (!userEvent) {
            throw new EventNotFoundError();
        }
        if (!userEvent.address) {
            throw new EventAddressNotFoundError();
        }
        if (userEvent.status === EventsStatusEnum.APPROVED) {
            const now = new Date();
            userEvent.updateStatus(this.resolveCurrentStatus(userEvent.startAt, userEvent.endAt, now))
        }
        return EventPresenter.toResponse(userEvent, userEvent.address);
    }

    // ACHAR TODOS OS EVENTOS DO USER byUserPersonId
    async allEventsOfUserByPersonId(adminPersonId: string, userPersonId: string, filters: FindEventFilters): Promise<EventResponseWithPaginationDto> {
        if (!adminPersonId) {
            throw new AdminIdNotFoundError();
        }
        if (!userPersonId) {
            throw new UserPersonIdNotFoundError();
        }
        await this.isAdminValidator.validate(adminPersonId);
        const user = await this.personRepository.findPersonById(userPersonId);
        if (!user) {
            throw new UserNotFoundError();
        }

        const events = await this.eventsRepository.findAllMyEventsWithFiltersByOwnerId(user.id, filters);

        const page = filters.page ? Number(filters.page) : 1;
        const limit = filters.limit ? Number(filters.limit) : 10;
        const totalPages = Math.max(1, Math.ceil(events.total / limit));
        const now = new Date();
        return {
            items: events.items.map((event) => {
                if (!event.address) {
                    throw new EventAddressNotFoundError();
                }
                if (event.status === EventsStatusEnum.APPROVED) {
                    event.updateStatus(this.resolveCurrentStatus(event.startAt, event.endAt, now))
                }
                return EventPresenter.toResponse(event, event.address);
            }),
            meta: {
                page: page,
                limit: limit,
                total: events.total,
                totalPages: totalPages,
                hasNextPage: totalPages > page,
                hasPreviousPage: page > 1,
            }
        }
    }

    // ACHAR TODOS OS EVENTOS COM FILTROS
    async allEventsWithFilters(adminPersonId: string, filters: FindEventFilters): Promise<EventResponseWithPaginationDto> {
        if (!adminPersonId) {
            throw new AdminIdNotFoundError();
        }
        await this.isAdminValidator.validate(adminPersonId);
        const events = await this.eventsRepository.findAllPublicEventsWithFilters(filters);
        
        const page = filters.page ? Number(filters.page) : 1;
        const limit = filters.limit ? Number(filters.limit) : 10;
        const totalPages = Math.max(1, Math.ceil(events.total / limit));
        const now = new Date();
        return {
            items: events.items.map((event) => {
                if (!event.address) {
                    throw new EventAddressNotFoundError();
                };
                if (event.status === EventsStatusEnum.APPROVED) {
                    event.updateStatus(this.resolveCurrentStatus(event.startAt, event.endAt, now))
                }
                return EventPresenter.toResponse(event, event.address)
            }),
            meta: {
                page,
                limit,
                total: events.total,
                totalPages,
                hasNextPage: totalPages > page,
                hasPreviousPage: page > 1,
            }
        }
    }
    // ACHAR UM EVENTO byEventId
    async byEventId(adminPersonId: string, eventId: string): Promise<EventResponseDto> {
        if (!adminPersonId) {
            throw new AdminIdNotFoundError();
        }
        if (!eventId) {
            throw new EventIdNotFoundError();
        }
        await this.isAdminValidator.validate(adminPersonId);
        const event = await this.eventsRepository.findByEventId(eventId)
        if (!event) {
            throw new EventNotFoundError();
        }
        if (!event.address) {
            throw new EventAddressNotFoundError()
        }
        if (event.status === EventsStatusEnum.APPROVED) {
            const now = new Date();
            event.updateStatus(this.resolveCurrentStatus(event.startAt, event.endAt, now))
        }
        return EventPresenter.toResponse(event, event.address)
    }


    // MÉTODO PRIVADO PARA ALTERAR O STATUS DE EVENTOS APROVADOS
    // ALTERAR SOMENTE NA MEMÓRIA E NÃO NO BANCO DE DADOS
    // POR ENQUANTO
    private resolveCurrentStatus(startAt: Date, endAt: Date, now: Date) {
        if (startAt > now) return EventsStatusEnum.UPCOMING;
        if (endAt < now) return EventsStatusEnum.CONCLUDED;
        return EventsStatusEnum.IN_PROGRESS;
    }
}