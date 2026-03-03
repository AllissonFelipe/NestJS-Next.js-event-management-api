import { Inject, Injectable } from '@nestjs/common';
import { ChangeUserEmailDto } from '../dtos/change-user-email.dto';
import { PersonIdNotFoundError } from 'src/shared/errors/person-id-not-found.error';
import { EnsureUserExists } from '../validator/ensure-user-exists.validator';
import { EnsureEmailIsAvailable } from '../validator/ensure-email-is-available.validator';
import { EmailAlreadyInUseError } from 'src/modules/person/domain/errors/email-already-In-use.error';
import {
  PERSON_REPOSITORY,
  type PersonRepositoryInterface,
} from 'src/modules/person/domain/person.repository-interface';
import { EmailChangeTokenDomainEntity } from 'src/modules/email-change-token/domain/email-change-token.domain-entity';
import { createHash, randomBytes } from 'crypto';
import {
  MAIL_SERVICE,
  type MailServiceInterface,
} from 'src/modules/mail/domain/mail-service.interface';
import { UNIT_OF_WORK } from 'src/database/unit-of-work.interface';
import { TypeOrmUnitOfWork } from 'src/database/typeorm-unit-of-work';
import {
  EMAIL_CHANGE_TOKEN_REPOSITORY,
  type EmailChangeTokenRepositoryInterface,
} from 'src/modules/email-change-token/domain/email-change-token.repository-interface';
import { EmailChangeTokenNotFoundError } from 'src/modules/email-change-token/domain/errors/email-token-change-not-found.error';
import { EmailChangeTokenAlreadyUsedError } from 'src/modules/email-change-token/domain/errors/email-token-change-already-used.error';
import { EmailChangeTokenExpiredError } from 'src/modules/email-change-token/domain/errors/email-token-change-expired.error';
import { PersonPresenter } from 'src/modules/person/application/responses/person-presenter.response';
import { PersonResponseDto } from 'src/modules/person/application/dtos/person-response.dto';

@Injectable()
export class ChangeUserEmailUseCase {
  constructor(
    @Inject(EMAIL_CHANGE_TOKEN_REPOSITORY)
    private readonly emailChangeTokenRepository: EmailChangeTokenRepositoryInterface,
    @Inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepositoryInterface,
    @Inject(MAIL_SERVICE)
    private readonly mailService: MailServiceInterface,
    @Inject(UNIT_OF_WORK)
    private readonly uow: TypeOrmUnitOfWork,
    @Inject()
    private readonly ensureUserExists: EnsureUserExists,
    @Inject()
    private readonly ensureEmailIsAvailable: EnsureEmailIsAvailable,
  ) {}

  async requestEmailChange(
    personId: string,
    dto: ChangeUserEmailDto,
  ): Promise<void> {
    if (!personId) {
      throw new PersonIdNotFoundError();
    }
    const person = await this.ensureUserExists.ensureUserExistsByPersonId(personId);
    if (dto.email === person.email) {
      throw new EmailAlreadyInUseError();
    }
    await this.ensureEmailIsAvailable.ensure(dto.email);

    const rawToken = randomBytes(32).toString('hex');
    console.log('RAW TOKEN:', rawToken);
    const hashToken = createHash('sha256').update(rawToken).digest('hex');
    console.log('HASH TOKEN:', hashToken);

    await this.uow.execute(async (manager) => {
      await this.emailChangeTokenRepository.markAllTokensAsUsed(
        person.id,
        manager,
      );
      const token = EmailChangeTokenDomainEntity.create({
        personId: person.id,
        token: hashToken,
        newEmail: dto.email,
        expiresAt: new Date(Date.now() + 1000 * 60 * 30),
      });

      await this.emailChangeTokenRepository.save(token, manager);
    });

    const link = `http://localhost:3000/user/profile/email-change/reset/${rawToken}`;
    console.log('LINK ENVIADO:', link);
    await this.mailService.sendResetEmailLink(dto.email, link);
  }

  async resetEmail(rawToken: string): Promise<PersonResponseDto> {
    console.log(`RAW TOKEN: ${rawToken}`)
    const hashToken = createHash('sha256').update(rawToken).digest('hex');
    console.log(`HASH TOKEN: ${hashToken}`)
    const token = await this.emailChangeTokenRepository.findByHashToken(hashToken);
    if (!token) {
      throw new EmailChangeTokenNotFoundError();
    }
    if (token.isExpired()) {
      throw new EmailChangeTokenExpiredError();
    }
    if (token.isUsed()) {
      throw new EmailChangeTokenAlreadyUsedError();
    }

    if (!token.personId) {
      throw new PersonIdNotFoundError();
    }
    const person = await this.ensureUserExists.ensureUserExistsByPersonId(
      token.personId,
    );

    const newPerson = await this.uow.execute(async (manager) => {
      await this.ensureEmailIsAvailable.ensure(token.newEmail);
      person.updateEmail(token.newEmail);
      const saved = await this.personRepository.updatePerson(person, manager);
      token.markAsUsed();
      await this.emailChangeTokenRepository.save(token, manager);
      return saved;
    });
    return PersonPresenter.toResponse(newPerson);
  }
}
