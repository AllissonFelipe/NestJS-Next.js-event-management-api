/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */

import { PasswordResetTokenDomainEntity } from "../domain/password-reset-token.domain-entity";
import { PasswordResetTokenOrmEntity } from "./password-reset-token.orm-entity";


export class PasswordResetTokenMapper {

    static toDomain(orm: PasswordResetTokenOrmEntity): PasswordResetTokenDomainEntity {
        return PasswordResetTokenDomainEntity.restore({
            id: orm.id,
            personId: orm.person_id.id,
            token: orm.token,
            expiresAt: orm.expires_at,
            usedAt: orm.used_at ?? null,
        })
    };

    static toOrm(domain: PasswordResetTokenDomainEntity): PasswordResetTokenOrmEntity {
        const orm = new PasswordResetTokenOrmEntity();

        orm.id = domain.id;
        orm.person_id = { id: domain.personId } as any;
        orm.token = domain.token;
        orm.expires_at = domain.expiresAt;
        orm.used_at = domain.usedAt;

        return orm;
    }

}