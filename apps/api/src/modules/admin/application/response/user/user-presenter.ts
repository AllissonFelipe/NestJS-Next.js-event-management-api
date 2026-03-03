/* eslint-disable prettier/prettier */
import { PersonProfileDomainEntity } from "src/modules/person-profile/domain/person-profile.domain-entity";
import { PersonRoleDomainEntity } from "src/modules/person-role/domain/person-role.domain-entity";
import { PersonDomainEntity } from "src/modules/person/domain/person.domain-entity";
import { UserPersonResponseDto, UserProfileResponseDto, UserResponseDto, UserRoleResponseDto } from "./user-response.dto";

export class UserPresenter {
    static toResponse(person: PersonDomainEntity, personRole: PersonRoleDomainEntity, profile: PersonProfileDomainEntity): UserResponseDto {
        return {
            person: UserPersonPresenter.toResponse(person),
            personRole: UserRolePresenter.toResponse(personRole),
            profile: UserProfilePresenter.toResponse(profile),
        }
    }
}
export class UserPersonPresenter {
    static toResponse(person: PersonDomainEntity): UserPersonResponseDto {
        return {
            id: person.id,
            fullName: person.fullName,
            cpf: person.cpf,
            email: person.email,
            isActive: person.isActive,
            createdAt: person.createdAt,
            updatedAt: person.updatedAt,
        }
    }
}
export class UserRolePresenter {
    static toResponse(personRole: PersonRoleDomainEntity): UserRoleResponseDto {
        return {
            id: personRole.id,
            role: personRole.role
        }
    }
}
export class UserProfilePresenter {
    static toResponse(profile: PersonProfileDomainEntity): UserProfileResponseDto {
        return {
            id: profile.id,
            avatarUrl: profile.avatarUrl,
            bio: profile.bio,
            phone: profile.phone,
            birthDate: profile.birthDate,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
        }
    }
}