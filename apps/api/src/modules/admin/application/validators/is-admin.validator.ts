/* eslint-disable prettier/prettier */
import { Inject, Injectable } from "@nestjs/common";
import { PersonDomainEntity } from "src/modules/person/domain/person.domain-entity";
import { PERSON_REPOSITORY, type PersonRepositoryInterface } from "src/modules/person/domain/person.repository-interface";
import { AdminNotFoundError } from "../../domain/errors/admin-not-found.error";
import { PersonRoleEnum } from "src/modules/person-role/domain/person-role.enum";
import { AdminRoleRequiredError } from "../../domain/errors/admin-role-required.error";

@Injectable()
export class IsAdminValidator {
    constructor (
        @Inject(PERSON_REPOSITORY)
        private readonly personRepository: PersonRepositoryInterface,
    ) {}

    async validate(adminPersonId: string): Promise<PersonDomainEntity> {
        const adminPerson = await this.personRepository.findPersonById(adminPersonId);
        if (!adminPerson) {
            throw new AdminNotFoundError();
        }
        if (adminPerson.personRole.role !== PersonRoleEnum.ADMIN) {
            throw new AdminRoleRequiredError();
        }
        return adminPerson;
    }
}