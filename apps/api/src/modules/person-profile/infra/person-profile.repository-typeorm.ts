/* eslint-disable prettier/prettier */
import { InjectRepository } from "@nestjs/typeorm";
import { PersonProfileOrmEntity } from "./person-profile.orm-entity";
import { EntityManager, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { PersonProfileDomainEntity } from "../domain/person-profile.domain-entity";
import { PersonProfileMapper } from "./person-profile.mapper";
import { PersonProfileRepositoryInterface } from "../domain/person-profile.repository-interface";

@Injectable()
export class PersonProfileRepositoryTypeOrm implements PersonProfileRepositoryInterface {
    constructor (
        @InjectRepository(PersonProfileOrmEntity)
        private readonly personProfileRepository: Repository<PersonProfileOrmEntity>,
    ) {}

    private getRepository(manager?: EntityManager): Repository<PersonProfileOrmEntity> {
        return manager ? manager.getRepository(PersonProfileOrmEntity) : this.personProfileRepository 
    }

    async saveProfile(profile: PersonProfileDomainEntity, manager?: EntityManager): Promise<PersonProfileDomainEntity> {
        const repository = this.getRepository(manager);
        const profileOrm = PersonProfileMapper.toOrm(profile);
        const saved = await repository.save(profileOrm)
        return PersonProfileMapper.toDomain(saved);
    }
}