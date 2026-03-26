import { SubscriptionPlansDomainEntity } from 'src/modules/subscription-plans/domain/subscription-plans.domain-entity';
import { SubscriptionPlanResponseDto } from './subscription-plan-response.dto';

export class SubscriptionPlanResponseMapper {
  static toResponse(entityDomain: SubscriptionPlansDomainEntity): SubscriptionPlanResponseDto {
    return {
      id: entityDomain.id,
      name: entityDomain.name,
      description: entityDomain.description,
      price: entityDomain.price,
      durationInDays: entityDomain.durationInDays
    };
  }
}
