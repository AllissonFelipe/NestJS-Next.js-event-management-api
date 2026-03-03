/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { AccountActivationTokenDomainEntity } from "../domain/account-activation-token.domain-entity";
import { AccountActivationTokenOrmEntity } from "./account-activation-token.orm-entity";


export class AccountActivationTokenMapper {

    static toDomain(
        orm: AccountActivationTokenOrmEntity
    ): AccountActivationTokenDomainEntity {
        return AccountActivationTokenDomainEntity.restore({
            id: orm.id,
            personId: orm.person_id.id,
            token: orm.token,
            expiresAt: orm.expires_at,
            usedAt: orm.used_at ?? null,
        });
    }

    static toOrm(
        domain: AccountActivationTokenDomainEntity
    ): AccountActivationTokenOrmEntity {
        const orm = new AccountActivationTokenOrmEntity();

        orm.id = domain.id;
        
        orm.person_id = { id: domain.personId } as any;
        // 👆 referência leve, sem carregar Person

        orm.token = domain.token;
        orm.expires_at = domain.expiresAt;
        orm.used_at = domain.usedAt;

        return orm;
    }
}
