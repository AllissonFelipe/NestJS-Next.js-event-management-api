/* eslint-disable prettier/prettier */
import { EntityManager } from "typeorm";
import { AccountActivationTokenDomainEntity } from "./account-activation-token.domain-entity";

export const ACCOUNT_ACTIVATION_TOKEN = Symbol('ACCOUNT_ACTIVATION_TOKEN');

export interface AccountActivationTokenRepositoryInterface {
    save(token: AccountActivationTokenDomainEntity, manager?: EntityManager): Promise<AccountActivationTokenDomainEntity>;
    findByToken(token: string, manager?: EntityManager): Promise<AccountActivationTokenDomainEntity | null>;
    deleteAllForPerson(personId: string, manager?: EntityManager): Promise<void>;

}