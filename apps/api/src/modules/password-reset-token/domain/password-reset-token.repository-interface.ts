/* eslint-disable prettier/prettier */
import { EntityManager } from "typeorm";
import { PasswordResetTokenDomainEntity } from "./password-reset-token.domain-entity";

export const PASSWORD_RESET_TOKEN = Symbol('PASSWORD_RESET_TOKEN');

export interface PasswordResetTokenRepositoryInterface {
    save(token: PasswordResetTokenDomainEntity, manager?: EntityManager): Promise<PasswordResetTokenDomainEntity>;
    findByToken(token: string, manager?: EntityManager): Promise<PasswordResetTokenDomainEntity | null>;
    markAllAsUsedByPerson(personId: string, manager?: EntityManager): Promise<void>;
}