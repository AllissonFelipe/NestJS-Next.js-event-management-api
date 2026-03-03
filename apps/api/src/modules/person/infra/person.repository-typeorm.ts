/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { PersonDomainEntity } from "../domain/person.domain-entity";
import { PersonOrmEntity } from "./person.orm-entity";
import { PersonRepositoryInterface } from "../domain/person.repository-interface";
import { PersonMapper } from "./person.mapper";
import { PersonRepositoryFiltersInterface } from "../domain/person-repository-filters-interface";
import { PaginationResultInterface } from "src/shared/interfaces/pagination-result.interface";


@Injectable()
export class PersonRepositoryTypeOrm implements PersonRepositoryInterface {    
    constructor (
        @InjectRepository(PersonOrmEntity)
        private readonly personRepo: Repository<PersonOrmEntity>,
    ) {}    
    
    private getPersonRepo(manager?: EntityManager): Repository<PersonOrmEntity> {
        return manager ? manager.getRepository(PersonOrmEntity) : this.personRepo;
    }
    
    // CREATE PERSON
    async createPerson(person: PersonDomainEntity, manager?: EntityManager): Promise<PersonDomainEntity> {
        const repository = this.getPersonRepo(manager);
        const personOrm = PersonMapper.toOrm(person);
        const saved = await repository.save(personOrm);
        const reloaded = await repository.findOne({
            where: { id: saved.id },
            relations: ['person_role', 'person_profile']
        })
        if (!reloaded) {
            throw new Error('Person not found after save');
        }
        return PersonMapper.toDomain(reloaded)
    }
    // DELETE PERSON
    async deletePerson(personId: string, manager?: EntityManager): Promise<boolean> {
        const repository = this.getPersonRepo(manager);
       const result = await repository.delete(personId);
        if (result.affected && result.affected > 0) {
            return true
        }
        return false;
    }
    // UPDATE PERSON
    async updatePerson (person: PersonDomainEntity, manager?: EntityManager): Promise<PersonDomainEntity> {
        const repository = this.getPersonRepo(manager);
        const personOrm = PersonMapper.toOrm(person);
        const saved = await repository.save(personOrm);
        const reloaded = await repository.findOne({
            where: { id: saved.id },
            relations: ['person_role', 'person_profile']
        })
        if (!reloaded) {
            throw new Error('Person not found after save');
        }
        return PersonMapper.toDomain(reloaded)
    }
    // FIND ALL PERSONS
    async findAllPersons(manager?: EntityManager): Promise<PersonDomainEntity[]> {
        const repository = this.getPersonRepo(manager);
        const personsOrm = await repository.find({
            relations: ['person_role', 'person_profile'],
        });
        const personsDomain = personsOrm.map((person) => PersonMapper.toDomain(person))
        return personsDomain;
    }
    // FIND PERSON ById
    async findPersonById(personId: string, manager?: EntityManager): Promise<PersonDomainEntity | null> {
        const repository = this.getPersonRepo(manager);
        const personOrm = await repository.findOne({
            where: { id: personId },
            relations: ['person_role', 'person_profile'],
        });
        if (!personOrm) return null;
        return PersonMapper.toDomain(personOrm);
    }
    // FIND PERSON ByEmail
    async findPersonByEmail(personEmail: string, manager?: EntityManager): Promise<PersonDomainEntity | null> {
        const repository = this.getPersonRepo(manager);
        const personOrm = await repository.findOne({
            where: { email: personEmail },
            relations: ['person_role', 'person_profile']
        });

        if (!personOrm) return null;

        const personDomain = PersonMapper.toDomain(personOrm);
        return personDomain
    }
    // FIND PERSON ByCPF
    async findPersonByCPF(personCPF: string, manager?: EntityManager): Promise<PersonDomainEntity | null> {
        const repository = this.getPersonRepo(manager);
        const personOrm = await repository.findOne({
            where: { cpf: personCPF },
            relations: ['person_role', 'person_profile']
        });

        if (!personOrm) return null;

        const personDomain = PersonMapper.toDomain(personOrm);
        return personDomain;
    }

    // FIND USERS WITH FILTERS ()
    async findWithFilters(filters: PersonRepositoryFiltersInterface, manager?: EntityManager): Promise<PaginationResultInterface<PersonDomainEntity>> {
        const repository = this.getPersonRepo(manager);
        const qb = repository
            .createQueryBuilder('person')
            .leftJoinAndSelect('person.person_role', 'personRole')
            .leftJoinAndSelect('person.person_profile', 'personProfile')
            .leftJoinAndSelect('person.events', 'events');
        if (filters.fullName) {
            qb.andWhere(`person.full_name ILIKE :fullName`, { fullName: `%${filters.fullName}%` })
        }
        if (filters.cpf) {
            qb.andWhere(`person.cpf ILIKE :cpf`, { cpf: `%${filters.cpf}%` })
        }
        if (filters.email) {
            qb.andWhere(`person.email ILIKE :email`, { email: `%${filters.email}%` })
        }
        if (filters.isActive !== undefined) {
            qb.andWhere(`person.is_active = :isActive`, { isActive: filters.isActive })
        }
        if (filters.createdAt) {
            qb.andWhere(`person.created_at ILIKE :createdAt`, { createdAt: `%${filters.createdAt}%` })
        }
        qb.orderBy('person.created_at', 'ASC')
        qb.skip((filters.page - 1) * filters.limit).take(filters.limit);
        const [ result, total ] = await qb.getManyAndCount();
        return {
            items: result.map((item) => PersonMapper.toDomain(item)),
            meta: {
                total
            },
        }
    }
}