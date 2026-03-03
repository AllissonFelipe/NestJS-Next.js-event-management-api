/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PasswordResetTokenOrmEntity } from "./password-reset-token.orm-entity";
import { EntityManager, IsNull, Repository } from "typeorm";
import { PasswordResetTokenRepositoryInterface } from "../domain/password-reset-token.repository-interface";
import { PasswordResetTokenDomainEntity } from "../domain/password-reset-token.domain-entity";
import { PasswordResetTokenMapper } from "./password-reset-token.mapper";

@Injectable()
export class PasswordResetTokenRepositoryTypeOrm implements PasswordResetTokenRepositoryInterface {
    constructor (
        @InjectRepository(PasswordResetTokenOrmEntity)
        private readonly passwordResetRepository: Repository<PasswordResetTokenOrmEntity>,
    ) {}

    private getRepository(manager?: EntityManager): Repository<PasswordResetTokenOrmEntity> {
        return manager ? manager.getRepository(PasswordResetTokenOrmEntity) : this.passwordResetRepository;
    }

    async markAllAsUsedByPerson(personId: string, manager?: EntityManager): Promise<void> {
        const repository = this.getRepository(manager);
        await repository.update(
            {
                person_id: { id: personId },
                used_at: IsNull(),
            },
            {
                used_at: new Date(),
            }
        )
    }
    
    async findByToken(token: string, manager?: EntityManager): Promise<PasswordResetTokenDomainEntity | null> {
        const repository = this.getRepository(manager);
        const tokenOrm = await repository.findOne({
            where: { token: token },
            relations: ['person_id']
        });
        if(!tokenOrm) return null;
        return PasswordResetTokenMapper.toDomain(tokenOrm);
    }
    
    async save(token: PasswordResetTokenDomainEntity, manager?: EntityManager): Promise<PasswordResetTokenDomainEntity> {
        const repository = this.getRepository(manager);
        const tokenOrm = PasswordResetTokenMapper.toOrm(token);
        const saved = await repository.save(tokenOrm);
        return PasswordResetTokenMapper.toDomain(saved);
    }
}