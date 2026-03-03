import { PersonDomainEntity } from 'src/modules/person/domain/person.domain-entity';
import {
  AdminProfileResponseDto,
  AdminResponseDto,
  AdminRoleResponseDto,
} from '../admin/admin-response.dto';
import { PersonRoleDomainEntity } from 'src/modules/person-role/domain/person-role.domain-entity';
import { PersonProfileDomainEntity } from 'src/modules/person-profile/domain/person-profile.domain-entity';

export class AdminPresenter {
  static toResponse(person: PersonDomainEntity): AdminResponseDto {
    return {
      id: person.id,
      fullName: person.fullName,
      cpf: person.cpf,
      email: person.email,
      personRole: AdminRolePresenter.toResponse(person.personRole),
      personProfile: AdminProfilePresenter.toResponse(person.personProfile),
      createdAt: person.createdAt,
      updatedAt: person.updatedAt,
    };
  }
}
export class AdminRolePresenter {
  static toResponse(personRole: PersonRoleDomainEntity): AdminRoleResponseDto {
    return {
      id: personRole.id,
      role: personRole.role,
    };
  }
}
export class AdminProfilePresenter {
  static toResponse(
    personProfile: PersonProfileDomainEntity,
  ): AdminProfileResponseDto {
    return {
      id: personProfile.id,
      avatarUrl: personProfile.avatarUrl,
      bio: personProfile.bio,
      birthDate: personProfile.birthDate,
      phone: personProfile.phone,
      createdAt: personProfile.createdAt,
      updatedAt: personProfile.updatedAt,
    };
  }
}
