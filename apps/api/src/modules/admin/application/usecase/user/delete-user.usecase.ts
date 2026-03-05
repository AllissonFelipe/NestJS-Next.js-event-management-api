/* eslint-disable prettier/prettier */
import { Inject, Injectable } from "@nestjs/common";
import { PERSON_REPOSITORY, type PersonRepositoryInterface } from "src/modules/person/domain/person.repository-interface";
import { AdminIdNotFoundError } from "../../../domain/errors/admin-id-not-found.error";
import { IsAdminValidator } from "../../validators/is-admin.validator";
import { UserNotFoundError } from "src/shared/errors/user-not-found.error";

@Injectable()
export class AdminDeleteUserUseCase {
    constructor (
        @Inject(PERSON_REPOSITORY)
        private readonly personRepository: PersonRepositoryInterface,
        @Inject()
        private readonly isAdminValidator: IsAdminValidator,
    ) {}

    async execute(adminRoleId: string, userPersonId: string): Promise<void> {
        if (!adminRoleId) {
            throw new AdminIdNotFoundError();
        }
        await this.isAdminValidator.validate(adminRoleId);
        
        const result = await this.personRepository.deletePerson(userPersonId);

        if (!result) {
            throw new UserNotFoundError();
        }
    }
}