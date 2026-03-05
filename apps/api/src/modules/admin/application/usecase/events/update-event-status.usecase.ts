/* eslint-disable prettier/prettier */
import { Inject } from "@nestjs/common";
import { IsAdminValidator } from "../../validators/is-admin.validator";
import { EventResponseDto } from "../../response/event/event-response.dto";
import { PERSON_REPOSITORY, type PersonRepositoryInterface } from "src/modules/person/domain/person.repository-interface";
import { UserNotFoundError } from "src/shared/errors/user-not-found.error";
import { EVENTS_REPOSITORY, type EventsRepositoryInterface } from "src/modules/events/domain/events.repository-interface";
import { EventNotFoundError } from "../../../domain/errors/admin-event-not-found.error";
import { AdminInvalidUpdatePayloadError } from "../../../domain/errors/admin-invalid-update-payload.error";
import { EventPresenter } from "../../response/event/event-presenter";
import { EventAddressNotFoundError } from "src/modules/events/domain/errors/event-address-not-found.error";
import { UpdateEventStatusDto } from "../../dtos/update-event-status.dto";
import { AdminIdNotFoundError } from "../../../domain/errors/admin-id-not-found.error";
import { EmptyUpdatePayloadError } from "src/shared/errors/empty-update-payload.error";
import { EventsStatusEnum } from "src/modules/events/domain/events-status.enum";

export class UpdateEventStatusUseCase {
    constructor (
        @Inject()
        private readonly isAdminValidator: IsAdminValidator,
        @Inject(PERSON_REPOSITORY)
        private readonly personRepository: PersonRepositoryInterface,
        @Inject(EVENTS_REPOSITORY)
        private readonly eventRepository: EventsRepositoryInterface,
    ) {}

    // ATUALIZAR UM EVENTO STATUS byEventId
    async updateEventStatus(adminPersonId: string, eventId: string, dto: UpdateEventStatusDto): Promise<EventResponseDto> {
        if (!dto.eventStatus) {
            throw new EmptyUpdatePayloadError();
        }
        if (!adminPersonId) {
            throw new AdminIdNotFoundError()
        }
        await this.isAdminValidator.validate(adminPersonId);
        const event = await this.eventRepository.findByEventId(eventId);
        if (!event) {
            throw new EventNotFoundError();
        }
        event.updateStatus(dto.eventStatus);
        const updatedEvent = await this.eventRepository.saveEvent(event);
        
        if (updatedEvent.status === EventsStatusEnum.APPROVED) {
            const now = new Date();
            updatedEvent.updateStatus(this.resolveCurrentStatus(updatedEvent.startAt, updatedEvent.endAt, now))
        }
        if (!updatedEvent.address) {
            throw new EventAddressNotFoundError();
        }
        return EventPresenter.toResponse(updatedEvent, updatedEvent.address)
    }

    // ATUALIZAR UM EVENTO STATUS DE UM USUÁRIO byUserPersonId && byEventId
    async updateUserEventStatus(adminPersonId: string, userPersonId: string, eventId: string, dto: UpdateEventStatusDto): Promise<EventResponseDto> {
        if (!dto.eventStatus) {
            throw new AdminInvalidUpdatePayloadError();
        }
        if (!adminPersonId) {
            throw new AdminIdNotFoundError();
        }
        await this.isAdminValidator.validate(adminPersonId);
        const user = await this.personRepository.findPersonById(userPersonId);
        if (!user) {
            throw new UserNotFoundError();
        }
        const userEvent = await this.eventRepository.findByOwnerAndId(user.id, eventId);
        if (!userEvent) {
            throw new EventNotFoundError();
        }
        userEvent.updateStatus(dto.eventStatus);
        const updatedEvent = await this.eventRepository.saveEvent(userEvent);

        if (updatedEvent.status === EventsStatusEnum.APPROVED) {
            const now = new Date();
            updatedEvent.updateStatus(this.resolveCurrentStatus(updatedEvent.startAt, updatedEvent.endAt, now))
        }
        if (!updatedEvent.address) {
            throw new EventAddressNotFoundError();
        }       
        return EventPresenter.toResponse(updatedEvent, updatedEvent.address)
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