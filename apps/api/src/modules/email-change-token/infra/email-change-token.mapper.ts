/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { EmailChangeTokenDomainEntity } from '../domain/email-change-token.domain-entity';
import { EmailChangeTokenOrmEntity } from './email-change-token.orm-entity';

export class EmailChangeTokenMapper {
  static toDomain(
    orm: EmailChangeTokenOrmEntity,
  ): EmailChangeTokenDomainEntity {
    return EmailChangeTokenDomainEntity.restore({
      id: orm.id,
      personId: orm.person_id.id,
      token: orm.token,
      expiresAt: orm.expires_at,
      newEmail: orm.new_email,
      usedAt: orm.used_at ?? null,
    });
  }

  static toOrm(
    domain: EmailChangeTokenDomainEntity,
  ): EmailChangeTokenOrmEntity {
    const orm = new EmailChangeTokenOrmEntity();

    orm.id = domain.id;
    orm.person_id = { id: domain.personId } as any;
    orm.token = domain.token;
    orm.expires_at = domain.expiresAt;
    orm.new_email = domain.newEmail;
    orm.used_at = domain.usedAt;

    return orm;
  }
}
