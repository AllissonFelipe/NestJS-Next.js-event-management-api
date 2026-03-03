/* eslint-disable prettier/prettier */
import { PersonRoleDomainEntity } from "src/modules/person-role/domain/person-role.domain-entity";
import { PersonDomainEntity } from "../../domain/person.domain-entity";
import { PersonProfileResponseDto, PersonResponseDto, PersonRoleResponseDto } from "../dtos/person-response.dto";
import { PersonProfileDomainEntity } from "src/modules/person-profile/domain/person-profile.domain-entity";

export class PersonPresenter {
    static toResponse(person: PersonDomainEntity): PersonResponseDto {
        return {
            id: person.id,
            fullName: person.fullName,
            cpf: person.cpf,
            email: person.email,
            personRole: PersonRolePresenter.toResponse(person.personRole),
            personProfile: PersonProfilePresenter.toResponse(person.personProfile),
            createdAt: person.createdAt,
            updatedAt: person.updatedAt,
        }
    }
}

export class PersonRolePresenter {
    static toResponse(personRole: PersonRoleDomainEntity): PersonRoleResponseDto {
        return {
            id: personRole.id,
            role: personRole.role
        }
    }
}

export class PersonProfilePresenter {
    static toResponse(personProfile: PersonProfileDomainEntity): PersonProfileResponseDto {
        return {
            id: personProfile.id,
            avatarUrl: personProfile.avatarUrl,
            bio: personProfile.bio,
            phone: personProfile.phone,
            birthDate: personProfile.birthDate,
            createdAt: personProfile.createdAt,
            updatedAt: personProfile.updatedAt
        }
    }
}

