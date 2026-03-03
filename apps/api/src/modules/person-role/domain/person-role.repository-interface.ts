/* eslint-disable prettier/prettier */
import { EntityManager } from "typeorm";
import { PersonRoleDomainEntity } from "./person-role.domain-entity";
import { PersonRoleEnum } from "./person-role.enum";

export const PERSON_ROLE_REPOSITORY = Symbol('PERSON_ROLE_REPOSITORY');

export interface PersonRoleRepositoryInterface {
    save(personRole: PersonRoleDomainEntity, manager?: EntityManager): Promise<PersonRoleDomainEntity>;
    findByRole(role: PersonRoleEnum): Promise<PersonRoleDomainEntity>
    findByRoleOrNull(role: PersonRoleEnum, manager?: EntityManager): Promise<PersonRoleDomainEntity | null>
}