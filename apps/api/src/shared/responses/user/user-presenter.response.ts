import { PersonProfileDomainEntity } from 'src/modules/person-profile/domain/person-profile.domain-entity';
import { PersonRoleDomainEntity } from 'src/modules/person-role/domain/person-role.domain-entity';
import { PersonDomainEntity } from 'src/modules/person/domain/person.domain-entity';
import {
  UserProfileResponseDto,
  UserResponseDto,
  UserRoleResponseDto,
} from './user-response.dto';

export class UserPresenter {
  static toResponse(person: PersonDomainEntity): UserResponseDto {
    return {
      id: person.id,
      fullName: person.fullName,
      cpf: person.cpf,
      email: person.email,
      userRole: UserRolePresenter.toResponse(person.personRole),
      userProfile: UserProfilePresenter.toResponse(person.personProfile),
      createdAt: person.createdAt,
      updatedAt: person.updatedAt,
    };
  }
}

export class UserRolePresenter {
  static toResponse(personRole: PersonRoleDomainEntity): UserRoleResponseDto {
    return {
      role: personRole.role,
    };
  }
}

export class UserProfilePresenter {
  static toResponse(
    personProfile: PersonProfileDomainEntity,
  ): UserProfileResponseDto {
    return {
      avatarUrl: personProfile.avatarUrl,
      bio: personProfile.bio,
      phone: personProfile.phone,
      birthDate: personProfile.birthDate,
      createdAt: personProfile.createdAt,
      updatedAt: personProfile.updatedAt,
    };
  }
}
