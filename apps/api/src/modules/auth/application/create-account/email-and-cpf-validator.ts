/* eslint-disable prettier/prettier */
import { Inject, Injectable } from "@nestjs/common";
import { PERSON_REPOSITORY } from "../../../person/domain/person.repository-interface";
import type { PersonRepositoryInterface } from "../../../person/domain/person.repository-interface";
import { EmailAlreadyInUseError } from "../../../person/domain/errors/email-already-In-use.error";
import { CpfAlreadyInUseError } from "../../../person/domain/errors/cpf-already-in-use.error";

@Injectable()
export class EmailAndCpfValidator {

    constructor (
        @Inject(PERSON_REPOSITORY)
        private readonly personRepo: PersonRepositoryInterface,
    ) {}

    async ensureEmailIsAvailable(personEmail: string): Promise<void> {
        const person = await this.personRepo.findPersonByEmail(personEmail);
        if (person) throw new EmailAlreadyInUseError();
    }
    async ensureCpfIsAvailable(personCPF: string): Promise<void> {
        const person = await this.personRepo.findPersonByCPF(personCPF);
        if (person) throw new CpfAlreadyInUseError(person.cpf);
    } 
}