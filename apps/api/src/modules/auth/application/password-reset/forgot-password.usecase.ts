/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import {
  UNIT_OF_WORK,
  type UnitOfWorkInterface,
} from 'src/database/unit-of-work.interface';
import {
  MAIL_SERVICE,
  type MailServiceInterface,
} from 'src/modules/mail/domain/mail-service.interface';
import { PasswordResetTokenDomainEntity } from 'src/modules/password-reset-token/domain/password-reset-token.domain-entity';
import {
  PASSWORD_RESET_TOKEN,
  type PasswordResetTokenRepositoryInterface,
} from 'src/modules/password-reset-token/domain/password-reset-token.repository-interface';
import { PersonNotFoundError } from 'src/modules/person/domain/errors/person-not-found.error';
import {
  PERSON_REPOSITORY,
  type PersonRepositoryInterface,
} from 'src/modules/person/domain/person.repository-interface';
import { PASSWORD_HASHER, type PasswordHasherInterface } from '../create-account/password-hasher.interface';
import { AccountNotActivatedError } from 'src/modules/person/domain/errors/account-not-activated.error';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    @Inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepositoryInterface,
    @Inject(PASSWORD_RESET_TOKEN)
    private readonly passwordResetRepository: PasswordResetTokenRepositoryInterface,
    @Inject(UNIT_OF_WORK)
    private readonly uow: UnitOfWorkInterface,
    @Inject(MAIL_SERVICE)
    private readonly mailService: MailServiceInterface,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherInterface,
  ) {}

  async executeForgotPassword(email: string): Promise<void> {
    const person = await this.personRepository.findPersonByEmail(email);
    if (!person) {
      throw new PersonNotFoundError();
    }
    if (!person.isAccountActivated()) {
        throw new AccountNotActivatedError()
    }

    const rawToken = randomBytes(32).toString('hex');
    const hashToken = createHash('sha256').update(rawToken).digest('hex');

    const resetToken = PasswordResetTokenDomainEntity.create({
      token: hashToken,
      personId: person.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 30),
    });

    await this.uow.execute(async (manager) => {
      await this.passwordResetRepository.markAllAsUsedByPerson(person.id, manager,
      );
      await this.passwordResetRepository.save(resetToken, manager);
    });

    const link = `http://localhost:3000/auth/reset-password/${rawToken}`;
    await this.mailService.sendAccountActivationEmail(person.email, link);
  }
}
