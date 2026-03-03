import { Injectable } from '@nestjs/common';
import { EmailChangeTokenRepositoryInterface } from '../domain/email-change-token.repository-interface';
import { EntityManager, IsNull, Repository } from 'typeorm';
import { EmailChangeTokenDomainEntity } from '../domain/email-change-token.domain-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailChangeTokenOrmEntity } from './email-change-token.orm-entity';
import { EmailChangeTokenMapper } from './email-change-token.mapper';

@Injectable()
export class EmailChangeTokenRepositoryTypeOrm implements EmailChangeTokenRepositoryInterface {
  constructor(
    @InjectRepository(EmailChangeTokenOrmEntity)
    private readonly emailChangeTokenRepository: Repository<EmailChangeTokenOrmEntity>,
  ) {}

  async findByHashToken(
    hashToken: string,
    manager?: EntityManager,
  ): Promise<EmailChangeTokenDomainEntity | null> {
    const repository = this.getRepository(manager);
    const tokenOrm = await repository.findOne({
      where: { token: hashToken },
      relations: ['person_id'],
    });
    if (!tokenOrm) return null;
    return EmailChangeTokenMapper.toDomain(tokenOrm);
  }

  async markAllTokensAsUsed(
    personId: string,
    manager?: EntityManager,
  ): Promise<void> {
    const repository = this.getRepository(manager);
    await repository.update(
      {
        person_id: { id: personId },
        used_at: IsNull(),
      },
      {
        used_at: new Date(),
      },
    );
  }

  private getRepository(
    manager?: EntityManager,
  ): Repository<EmailChangeTokenOrmEntity> {
    return manager
      ? manager.getRepository(EmailChangeTokenOrmEntity)
      : this.emailChangeTokenRepository;
  }

  async save(
    token: EmailChangeTokenDomainEntity,
    manager?: EntityManager,
  ): Promise<EmailChangeTokenDomainEntity> {
    const repository = this.getRepository(manager);
    const tokenOrm = EmailChangeTokenMapper.toOrm(token);
    await repository.save(tokenOrm);
    return token;
  }
}
