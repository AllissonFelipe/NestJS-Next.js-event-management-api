import { SubscriptionPlansDomainEntity } from 'src/modules/subscription-plans/domain/subscription-plans.domain-entity';
import {
  AdminPersonProfileResponseDto,
  AdminPersonResponseDto,
  AdminPersonRoleResponseDto,
  AdminSubscriptionPlanResponseDto,
} from './admin-subscription-plan-response.dto';
import { PersonDomainEntity } from 'src/modules/person/domain/person.domain-entity';
import { PersonRoleDomainEntity } from 'src/modules/person-role/domain/person-role.domain-entity';
import { PersonProfileDomainEntity } from 'src/modules/person-profile/domain/person-profile.domain-entity';

export class AdminSubscriptionPlanResponseMapper {
  static toResponse(entityDomain: SubscriptionPlansDomainEntity): AdminSubscriptionPlanResponseDto {
    return {
      id: entityDomain.id,
      name: entityDomain.name,
      description: entityDomain.description,
      price: entityDomain.price,
      durationInDays: entityDomain.durationInDays,
      isActive: entityDomain.isActive,
      createdBy: this.createdByResponse(entityDomain.createdBy),
      createdAt: entityDomain.createdAt,
      updatedAt: entityDomain.updatedAt,
    };
  }

  static createdByResponse(entityDomain: PersonDomainEntity): AdminPersonResponseDto {
    return {
      id: entityDomain.id,
      fullName: entityDomain.fullName,
      email: entityDomain.email,
      personRole: this.personRoleResponse(entityDomain.personRole),
      personProfile: this.personProfileResponse(entityDomain.personProfile),
    };
  }

  static personRoleResponse(entityDomain: PersonRoleDomainEntity): AdminPersonRoleResponseDto {
    return {
      id: entityDomain.id,
      role: entityDomain.role,
    };
  }

  static personProfileResponse(
    entityDomain: PersonProfileDomainEntity,
  ): AdminPersonProfileResponseDto {
    return {
      id: entityDomain.id,
      avatarUrl: entityDomain.avatarUrl,
      phone: entityDomain.phone,
    };
  }
}
