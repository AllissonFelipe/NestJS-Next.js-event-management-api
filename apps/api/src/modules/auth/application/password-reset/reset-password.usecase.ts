import { Inject, Injectable } from '@nestjs/common';
import {
  PASSWORD_RESET_TOKEN,
  type PasswordResetTokenRepositoryInterface,
} from 'src/modules/password-reset-token/domain/password-reset-token.repository-interface';
import {
  PERSON_REPOSITORY,
  type PersonRepositoryInterface,
} from 'src/modules/person/domain/person.repository-interface';
import {
  PASSWORD_HASHER,
  type PasswordHasherInterface,
} from '../create-account/password-hasher.interface';
import {
  UNIT_OF_WORK,
  type UnitOfWorkInterface,
} from 'src/database/unit-of-work.interface';
import { PasswordResetTokenNotFoundError } from 'src/modules/password-reset-token/domain/errors/reset-token-not-found.error';
import { ResetPasswordTokenExpiredError } from 'src/modules/password-reset-token/domain/errors/reset-token-expired.error';
import { PasswordResetTokenAlreadyUsedError } from 'src/modules/password-reset-token/domain/errors/reset-token-already-used.error';
import { createHash } from 'crypto';
import { PersonNotFoundError } from 'src/modules/person/domain/errors/person-not-found.error';
import { CannotReuseSamePasswordError } from 'src/modules/person/domain/errors/cannot-reuse-same-password-error';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepositoryInterface,
    @Inject(PASSWORD_RESET_TOKEN)
    private readonly passwordResetRepository: PasswordResetTokenRepositoryInterface,
    @Inject(UNIT_OF_WORK)
    private readonly uow: UnitOfWorkInterface,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherInterface,
  ) {}

  async executeResetPassword(
    rawToken: string,
    newPassword: string,
  ): Promise<void> {
    const hashToken = createHash('sha256').update(rawToken).digest('hex');
    const token = await this.passwordResetRepository.findByToken(hashToken);
    if (!token) {
      throw new PasswordResetTokenNotFoundError();
    }
    if (token.isExpired()) {
      throw new ResetPasswordTokenExpiredError();
    }
    if (token.isUsed()) {
      throw new PasswordResetTokenAlreadyUsedError();
    }

    await this.uow.execute(async (manager) => {
      const person = await this.personRepository.findPersonById(token.personId);
      if (!person) {
        throw new PersonNotFoundError();
      }
      if (await this.passwordHasher.compare(newPassword, person.passwordHash)) {
        throw new CannotReuseSamePasswordError();
      }
      const hashPassword = await this.passwordHasher.hash(newPassword);
      person.updatePassword(hashPassword);
      await this.personRepository.updatePerson(person, manager);
      await this.passwordResetRepository.markAllAsUsedByPerson(
        person.id,
        manager,
      );
    });
  }
}
