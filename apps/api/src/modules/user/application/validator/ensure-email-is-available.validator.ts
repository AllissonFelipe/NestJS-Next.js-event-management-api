import { Inject, Injectable } from '@nestjs/common';
import { EmailAlreadyInUseError } from 'src/modules/person/domain/errors/email-already-In-use.error';
import {
  PERSON_REPOSITORY,
  type PersonRepositoryInterface,
} from 'src/modules/person/domain/person.repository-interface';

@Injectable()
export class EnsureEmailIsAvailable {
  constructor(
    @Inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepositoryInterface,
  ) {}

  async ensure(rawEmail: string): Promise<void> {
    const email = rawEmail.toLowerCase().trim();
    const person = await this.personRepository.findPersonByEmail(email);
    if (person) {
      throw new EmailAlreadyInUseError();
    }
  }
}
