/* eslint-disable prettier/prettier */
import { EntityManager } from "typeorm";
import { PersonDomainEntity } from "./person.domain-entity";
import { PersonRepositoryFiltersInterface } from "./person-repository-filters-interface";
import { PaginationResultInterface } from "src/shared/interfaces/pagination-result.interface";

export const PERSON_REPOSITORY = Symbol('PERSON_REPOSITORY');

export interface PersonRepositoryInterface {
    createPerson(person: PersonDomainEntity, manager?: EntityManager): Promise<PersonDomainEntity>;
    updatePerson(person: PersonDomainEntity, manager?: EntityManager): Promise<PersonDomainEntity>;
    findAllPersons(manager?: EntityManager): Promise<PersonDomainEntity[]>;
    findPersonById(personId: string, manager?: EntityManager): Promise<PersonDomainEntity | null>;
    findPersonByEmail(personEmail: string, manager?: EntityManager): Promise<PersonDomainEntity | null>;
    findPersonByCPF(personCPF: string, manager?: EntityManager): Promise<PersonDomainEntity | null>;
    deletePerson(personId: string, manager?: EntityManager): Promise<boolean>;
    findWithFilters(filter: PersonRepositoryFiltersInterface, manager?: EntityManager): Promise<PaginationResultInterface<PersonDomainEntity>>
}

