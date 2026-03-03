/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import {
  UNIT_OF_WORK,
  type UnitOfWorkInterface,
} from 'src/database/unit-of-work.interface';
import { AccountActivationTokenDomainEntity } from 'src/modules/account-activation-token/domain/account-activation-token.domain-entity';
import {
  ACCOUNT_ACTIVATION_TOKEN,
  type AccountActivationTokenRepositoryInterface,
} from 'src/modules/account-activation-token/domain/account-activation-token.repository-interface';
import { ActivationTokenAlreadyUsedError } from 'src/modules/account-activation-token/domain/errors/activation-token-already-used.error';
import { ActivationTokenExpiredError } from 'src/modules/account-activation-token/domain/errors/activation-token-expired.error';
import { ActivationTokenNotFoundError } from 'src/modules/account-activation-token/domain/errors/activation-token-not-found.error';
import { ActivationTokenRequiredError } from 'src/modules/account-activation-token/domain/errors/activation-token-required.error';
import { MAIL_SERVICE, type MailServiceInterface } from 'src/modules/mail/domain/mail-service.interface';
import { AccountAlreadyActivatedError } from 'src/modules/person/domain/errors/account-already-activated.error';
import { PersonNotFoundError } from 'src/modules/person/domain/errors/person-not-found.error';
import {
  PERSON_REPOSITORY,
  type PersonRepositoryInterface,
} from 'src/modules/person/domain/person.repository-interface';

@Injectable()
export class ActivateAccountUseCase {
  constructor(
    @Inject(ACCOUNT_ACTIVATION_TOKEN)
    private readonly accountActivationTokenRepository: AccountActivationTokenRepositoryInterface,
    @Inject(UNIT_OF_WORK)
    private readonly uow: UnitOfWorkInterface,
    @Inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepositoryInterface,
    @Inject(MAIL_SERVICE)
    private readonly mailService: MailServiceInterface,
  ) {}

  async executeActivateAccount(rawToken: string): Promise<void> {
    
    if(!rawToken) {
        throw new ActivationTokenRequiredError();
    }

    const hashToken = createHash('sha256').update(rawToken).digest('hex');
    const token = await this.accountActivationTokenRepository.findByToken(hashToken);
    if (!token) {
      throw new ActivationTokenNotFoundError();
    }
    if (token.isUsed()) {
      throw new ActivationTokenAlreadyUsedError();
    }
    if (token.isExpired()) {
      throw new ActivationTokenExpiredError();
    }

    const person = await this.personRepository.findPersonById(token.personId);
    if (!person) {
      throw new PersonNotFoundError();
    }
    if (person.isAccountActivated()) {
        throw new AccountAlreadyActivatedError();
    }

    await this.uow.execute(async (manager) => {
      token.markAsUsed();
      await this.accountActivationTokenRepository.save(token, manager);
      person.activateAccount();
      await this.personRepository.updatePerson(person);
    });
  }

  async executeResendActivationEmail(email: string): Promise<void> {
    const person = await this.personRepository.findPersonByEmail(email);
    if (!person) {
        throw new PersonNotFoundError();
    }
    if (person.isAccountActivated()) {
        throw new AccountAlreadyActivatedError();
    }

    const rawToken = randomBytes(32).toString('hex');
    const hashToken = createHash('sha256').update(rawToken).digest('hex');

    await this.accountActivationTokenRepository.deleteAllForPerson(person.id);
    const token = AccountActivationTokenDomainEntity.create({
        personId: person.id,
        token: hashToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
    })
    await this.accountActivationTokenRepository.save(token);

    const link = `http://localhost:3000/auth/activate-account/${rawToken}`;
    console.log('Resend activation token: ', link);
    await this.mailService.sendAccountActivationEmail(person.email, link);
  }
}
