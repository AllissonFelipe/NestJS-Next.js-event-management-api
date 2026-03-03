/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { EnsureUserExists } from '../validator/ensure-user-exists.validator';
import { PersonIdNotFoundError } from 'src/shared/errors/person-id-not-found.error';
import { UserPresenter } from 'src/shared/responses/user/user-presenter.response';

@Injectable()
export class FindUserProfileUseCase {
  constructor(
    @Inject()
    private readonly ensureUserExists: EnsureUserExists,
  ) {}

  async findUserProfileByPersonId(personId: string) {
    if (!personId) {
      throw new PersonIdNotFoundError();
    }

    const user = await this.ensureUserExists.ensureUserExistsByPersonId(personId);

    return UserPresenter.toResponse(user);
  }
}
