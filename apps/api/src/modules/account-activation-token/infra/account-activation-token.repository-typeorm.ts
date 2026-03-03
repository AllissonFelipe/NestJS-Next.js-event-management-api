/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { AccountActivationTokenRepositoryInterface } from "../domain/account-activation-token.repository-interface";
import { InjectRepository } from "@nestjs/typeorm";
import { AccountActivationTokenOrmEntity } from "./account-activation-token.orm-entity";
import { EntityManager, Repository } from "typeorm";
import { AccountActivationTokenDomainEntity } from "../domain/account-activation-token.domain-entity";
import { AccountActivationTokenMapper } from "./account-activation-token.mapper";

@Injectable()
export class AccountActivationTokenRepositoryTypeOrm implements AccountActivationTokenRepositoryInterface {

    constructor (
        @InjectRepository(AccountActivationTokenOrmEntity)
        private readonly acivationTokenRepo: Repository<AccountActivationTokenOrmEntity>
    ) {}
    
    private getRepo(manager?: EntityManager): Repository<AccountActivationTokenOrmEntity> {
        return manager ? manager.getRepository(AccountActivationTokenOrmEntity) : this.acivationTokenRepo;
    }

    async save(token: AccountActivationTokenDomainEntity, manager?: EntityManager): Promise<AccountActivationTokenDomainEntity> {
        const repository = this.getRepo(manager);
        const tokenOrm = AccountActivationTokenMapper.toOrm(token);
        const saved = await repository.save(tokenOrm);
        return AccountActivationTokenMapper.toDomain(saved);
    }   

    async findByToken(token: string, manager?: EntityManager): Promise<AccountActivationTokenDomainEntity | null> {
        const repository = this.getRepo(manager);
        const accountActivationTokenOrm = await repository.findOne({
            where: { token: token },
            relations: ['person_id'],
        })
        if (!accountActivationTokenOrm) return null;
        return AccountActivationTokenMapper.toDomain(accountActivationTokenOrm);
    }

    async deleteAllForPerson(personId: string, manager?: EntityManager): Promise<void> {
        const repository = this.getRepo(manager);
        await repository
            .createQueryBuilder()
            .delete()
            .from(AccountActivationTokenOrmEntity)
            .where('person_id = :personId', { personId })
            .execute();
    }
}