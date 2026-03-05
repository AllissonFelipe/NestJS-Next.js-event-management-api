/* eslint-disable prettier/prettier */
import { Inject, Injectable } from "@nestjs/common";
import { AdminIdNotFoundError } from "../../../domain/errors/admin-id-not-found.error";
import { IsAdminValidator } from "../../validators/is-admin.validator";
import { EVENTS_REPOSITORY, type EventsRepositoryInterface } from "src/modules/events/domain/events.repository-interface";
import { EventNotFoundError } from "../../../domain/errors/admin-event-not-found.error";

@Injectable()
export class DeleteEventUseCase {
    constructor (
        @Inject()
        private readonly isAdminValidator: IsAdminValidator,
        @Inject(EVENTS_REPOSITORY)
        private readonly eventRepository: EventsRepositoryInterface,
    ) {}

    // DELETA UM EVENTO DO USUÁRIO byUserPersonId && eventId
    async deleteUserEvent(adminPersonId: string, userPersonId: string, eventId: string): Promise<void> {
        if (!adminPersonId) {
            throw new AdminIdNotFoundError();
        }
        await this.isAdminValidator.validate(adminPersonId);

        const result = await this.eventRepository.deleteByPersonIdAndEventId(userPersonId, eventId);

        if (!result) {
            throw new EventNotFoundError();
        }
    }

    // DELETA EVENTO byEventId
    async deleteEventById(adminPersonId: string, eventId: string): Promise<void> {
        if (!adminPersonId) {
            throw new AdminIdNotFoundError();
        }
        await this.isAdminValidator.validate(adminPersonId);

        const result = await this.eventRepository.deleteEventById(eventId);

        if (!result) {
            throw new EventNotFoundError();
        }
    }
}