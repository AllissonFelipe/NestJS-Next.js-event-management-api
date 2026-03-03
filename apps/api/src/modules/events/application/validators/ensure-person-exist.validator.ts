import { Inject, Injectable } from '@nestjs/common';
import { PersonRoleEnum } from 'src/modules/person-role/domain/person-role.enum';
import { PersonDomainEntity } from 'src/modules/person/domain/person.domain-entity';
import {
  PERSON_REPOSITORY,
  type PersonRepositoryInterface,
} from 'src/modules/person/domain/person.repository-interface';
import { PersonIdNotFoundError } from 'src/shared/errors/person-id-not-found.error';
import { PersonNotFoundError } from 'src/shared/errors/person-not-found.error';
import { PersonRoleNotAllowedError } from 'src/shared/errors/person-role-not-allowed.error';

@Injectable()
export class EnsurePersonExists {
  constructor(
    @Inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepositoryInterface,
  ) {}

  async ensure(personId: string): Promise<PersonDomainEntity> {
    if (!personId) {
      throw new PersonIdNotFoundError(personId);
    }
    const person = await this.personRepository.findPersonById(personId);
    if (!person) {
      throw new PersonNotFoundError(personId);
    }

    const allowedRoles = [PersonRoleEnum.USER, PersonRoleEnum.ADMIN];
    if (!allowedRoles.includes(person.personRole.role)) {
      throw new PersonRoleNotAllowedError(person.personRole.role);
    }
    return person;
  }
}
