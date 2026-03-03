/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import {
  PERSON_PROFILE_REPOSITORY,
  type PersonProfileRepositoryInterface,
} from 'src/modules/person-profile/domain/person-profile.repository-interface';
import {
  PERSON_REPOSITORY,
  type PersonRepositoryInterface,
} from 'src/modules/person/domain/person.repository-interface';
import { UserResponseDto } from '../../../../shared/responses/user/user-response.dto';
import { PersonIdNotFoundError } from 'src/shared/errors/person-id-not-found.error';
import { EnsureUserExists } from '../validator/ensure-user-exists.validator';
import { UpdateUserProfileDto } from '../dtos/update-user-profile.dto';
import { EmptyUpdatePayloadError } from 'src/shared/errors/empty-update-payload.error';
import { UNIT_OF_WORK } from 'src/database/unit-of-work.interface';
import { TypeOrmUnitOfWork } from 'src/database/typeorm-unit-of-work';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { UserPresenter } from 'src/shared/responses/user/user-presenter.response';

@Injectable()
export class UpdateUserProfileUsecase {
  constructor(
    @Inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepositoryInterface,
    @Inject(PERSON_PROFILE_REPOSITORY)
    private readonly personProfileRepository: PersonProfileRepositoryInterface,
    @Inject(UNIT_OF_WORK)
    private readonly uow: TypeOrmUnitOfWork,
    @Inject()
    private readonly ensureUserExists: EnsureUserExists,
  ) {}

  async updateUserProfileByPersonId(
    personId: string,
    dto: UpdateUserProfileDto,
  ): Promise<UserResponseDto> {
    if (!personId) {
      throw new PersonIdNotFoundError();
    }

    if (
      !dto ||
      Object.keys(dto).length === 0 ||
      (dto.person && Object.keys(dto.person).length === 0) ||
      (dto.profile && Object.keys(dto.profile).length === 0)
    ) {
      throw new EmptyUpdatePayloadError();
    }

    const person = await this.ensureUserExists.ensureUserExistsByPersonId(personId);

    await this.uow.execute(async (manager) => {
      if (dto.person) {
        person.updateAll(dto.person);
      }
      if (dto.profile) {
        person.personProfile.updateAll(dto.profile);
      }
      await this.personRepository.updatePerson(person, manager);
      await this.personProfileRepository.saveProfile(
        person.personProfile,
        manager,
      );
    });
    const updatePerson = await this.personRepository.findPersonById(person.id);
    if (!updatePerson) {
      throw new UserNotFoundError();
    }
    return UserPresenter.toResponse(updatePerson);
  }
}
