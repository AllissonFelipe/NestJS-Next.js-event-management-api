/* eslint-disable prettier/prettier */
import { Inject, Injectable } from "@nestjs/common";
import { EnsureUserExists } from "../validator/ensure-user-exists.validator";
import { UserPersonIdNotFoundError } from "../../domain/errors/user-person-id-not-found.error";
import { EVENTS_REPOSITORY, type EventsRepositoryInterface } from "src/modules/events/domain/events.repository-interface";
import { EventNotFoundError } from "src/modules/events/domain/errors/event-not-found-error";

@Injectable()
export class UserDeleteEventUseCase {
    constructor (
        @Inject()
        private readonly ensureUserExist: EnsureUserExists,
        @Inject(EVENTS_REPOSITORY)
        private readonly eventsRepository: EventsRepositoryInterface,
    ) {}

    async execute(userPersonId: string, eventId: string): Promise<void> {
        if (!userPersonId) {
            throw new UserPersonIdNotFoundError();
        }
        await this.ensureUserExist.ensureUserExistsByPersonId(userPersonId);
        const result = await this.eventsRepository.deleteByOwnerAndId(userPersonId, eventId);
        if (!result) {
            throw new EventNotFoundError()
        }
    }
}