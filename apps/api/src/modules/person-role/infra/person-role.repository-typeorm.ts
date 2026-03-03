/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PersonRoleOrmEntity } from "./person-role.orm-entity";
import { EntityManager, Repository } from "typeorm";
import { PersonRoleRepositoryInterface } from "../domain/person-role.repository-interface";
import { PersonRoleDomainEntity } from "../domain/person-role.domain-entity";
import { PersonRoleEnum } from "../domain/person-role.enum";
import { PersonRoleMapper } from "./person-role.mapper";

@Injectable()
export class PersonRoleRepositoryTypeOrm implements PersonRoleRepositoryInterface {
    constructor (
        @InjectRepository(PersonRoleOrmEntity)
        private readonly personRoleRepository: Repository<PersonRoleOrmEntity>,
    ) {}
    
    async save(personRole: PersonRoleDomainEntity, manager?: EntityManager): Promise<PersonRoleDomainEntity> {
        const repository = this.getRepository(manager);
        const personRoleOrm = PersonRoleMapper.toOrm(personRole);
        const saved = await repository.save(personRoleOrm);
        return PersonRoleMapper.toDomain(saved);
    }

    async findByRoleOrNull(role: PersonRoleEnum, manager?: EntityManager): Promise<PersonRoleDomainEntity | null> {
        const repository = this.getRepository(manager);
        const roleOrm = await repository.findOne({
            where: { role: role },
        })
        if (!roleOrm) return null;
        return PersonRoleMapper.toDomain(roleOrm);
    }

    async findByRole(role: PersonRoleEnum, manager?: EntityManager): Promise<PersonRoleDomainEntity> {
        const repository = this.getRepository(manager);
        const roleOrm = await repository.findOne({
            where: { role: role },
        })
        if (!roleOrm) {
            throw new Error(`PersonRole '${role}' not found`);
        }
        return PersonRoleMapper.toDomain(roleOrm);
    }



    private getRepository(manager?: EntityManager): Repository<PersonRoleOrmEntity> {
        return manager ? manager.getRepository(PersonRoleOrmEntity) : this.personRoleRepository;
    }
}