import { Inject, Injectable } from '@nestjs/common';
import { PersonRoleEnum } from 'src/modules/person-role/domain/person-role.enum';
import {
  PERSON_REPOSITORY,
  type PersonRepositoryInterface,
} from 'src/modules/person/domain/person.repository-interface';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { UserRoleRequiredError } from '../../domain/errors/user-role-required.error';
import { PersonDomainEntity } from 'src/modules/person/domain/person.domain-entity';

@Injectable()
export class EnsureUserExists {
  constructor(
    @Inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepositoryInterface,
  ) {}

  async ensureUserExistsByPersonId(
    personId: string,
  ): Promise<PersonDomainEntity> {
    const person = await this.personRepository.findPersonById(personId);
    if (!person) {
      throw new UserNotFoundError();
    }

    const allowedRoles = [PersonRoleEnum.USER, PersonRoleEnum.ADMIN];

    if (!allowedRoles.includes(person.personRole.role)) {
      throw new UserRoleRequiredError();
    }
    return person;
  }
}
