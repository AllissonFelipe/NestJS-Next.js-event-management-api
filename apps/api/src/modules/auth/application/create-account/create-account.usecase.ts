import { Inject, Injectable } from '@nestjs/common';
import {
  PERSON_REPOSITORY,
  type PersonRepositoryInterface,
} from 'src/modules/person/domain/person.repository-interface';
import { CreateAccountDto } from './create-account.dto';
import { EmailAndCpfValidator } from './email-and-cpf-validator';
import {
  PASSWORD_HASHER,
  type PasswordHasherInterface,
} from './password-hasher.interface';
import { PersonDomainEntity } from 'src/modules/person/domain/person.domain-entity';
import { PersonProfileDomainEntity } from 'src/modules/person-profile/domain/person-profile.domain-entity';
import { PersonRoleEnum } from 'src/modules/person-role/domain/person-role.enum';
import {
  UNIT_OF_WORK,
  type UnitOfWorkInterface,
} from 'src/database/unit-of-work.interface';
import {
  PERSON_ROLE_REPOSITORY,
  type PersonRoleRepositoryInterface,
} from 'src/modules/person-role/domain/person-role.repository-interface';
import {
  PERSON_PROFILE_REPOSITORY,
  type PersonProfileRepositoryInterface,
} from 'src/modules/person-profile/domain/person-profile.repository-interface';
import { createHash, randomBytes, randomUUID } from 'crypto';
import {
  MAIL_SERVICE,
  type MailServiceInterface,
} from 'src/modules/mail/domain/mail-service.interface';
import { AccountActivationTokenDomainEntity } from 'src/modules/account-activation-token/domain/account-activation-token.domain-entity';
import {
  ACCOUNT_ACTIVATION_TOKEN,
  type AccountActivationTokenRepositoryInterface,
} from 'src/modules/account-activation-token/domain/account-activation-token.repository-interface';
import { PersonResponseDto } from 'src/modules/person/application/dtos/person-response.dto';
import { PersonPresenter } from 'src/modules/person/application/responses/person-presenter.response';

@Injectable()
export class CreateAccountUseCase {
  constructor(
    @Inject(UNIT_OF_WORK)
    private readonly uow: UnitOfWorkInterface,
    @Inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepositoryInterface,
    @Inject(PERSON_ROLE_REPOSITORY)
    private readonly personRoleRepository: PersonRoleRepositoryInterface,
    @Inject(PERSON_PROFILE_REPOSITORY)
    private readonly personProfileRepository: PersonProfileRepositoryInterface,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherInterface,
    @Inject(ACCOUNT_ACTIVATION_TOKEN)
    private readonly accountActivationTokenRepository: AccountActivationTokenRepositoryInterface,
    @Inject(MAIL_SERVICE)
    private readonly mailService: MailServiceInterface,
    @Inject()
    private readonly emailAndCpfValidator: EmailAndCpfValidator,
  ) {}

  async execute(dto: CreateAccountDto): Promise<PersonResponseDto> {
    await this.emailAndCpfValidator.ensureCpfIsAvailable(dto.cpf);
    await this.emailAndCpfValidator.ensureEmailIsAvailable(dto.email);
    const hashPassword = await this.passwordHasher.hash(dto.password);

    const personProfile = PersonProfileDomainEntity.create({
      id: randomUUID(),
    });

    const personRole = await this.personRoleRepository.findByRole(
      PersonRoleEnum.USER,
    );

    const person = PersonDomainEntity.create({
      fullName: dto.fullName,
      cpf: dto.cpf,
      email: dto.email,
      passwordHash: hashPassword,
      personRole: personRole,
      personProfile: personProfile,
      isActive: false,
    });

    const rawToken = randomBytes(32).toString('hex');
    const hashToken = createHash('sha256').update(rawToken).digest('hex');

    const result = await this.uow.execute(async (manager) => {
      await this.personProfileRepository.saveProfile(personProfile, manager);
      const account = await this.personRepository.createPerson(person, manager);
      const token = AccountActivationTokenDomainEntity.create({
        personId: account.id,
        token: hashToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h,
      });
      await this.accountActivationTokenRepository.save(token, manager);
      return account;
    });

    const link = `http://localhost:3000/auth/activate-account/${rawToken}`;
    console.log('Activation token: ', link);
    await this.mailService.sendAccountActivationEmail(result.email, link);

    return PersonPresenter.toResponse(result);
  }
}
