import { EntityManager } from 'typeorm';
import { EmailChangeTokenDomainEntity } from './email-change-token.domain-entity';

export const EMAIL_CHANGE_TOKEN_REPOSITORY = Symbol(
  'EMAIL_CHANGE_TOKEN_REPOSITORY',
);

export interface EmailChangeTokenRepositoryInterface {
  save(
    token: EmailChangeTokenDomainEntity,
    manager?: EntityManager,
  ): Promise<EmailChangeTokenDomainEntity>;
  markAllTokensAsUsed(personId: string, manager?: EntityManager): Promise<void>;
  findByHashToken(
    hashToken: string,
    manager?: EntityManager,
  ): Promise<EmailChangeTokenDomainEntity | null>;
}
