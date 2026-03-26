import { Inject, Injectable } from '@nestjs/common';
import { CreateSubscriptionPlanDto } from '../../dtos/create-subscription-plan.dto';
import { IsAdminValidator } from '../../validators/is-admin.validator';
import { SubscriptionPlansDomainEntity } from 'src/modules/subscription-plans/domain/subscription-plans.domain-entity';
import {
  SUBSCRIPTION_PLANS_REPOSITORY,
  type SubscriptionPlansRepositoryInterface
} from 'src/modules/subscription-plans/domain/subscription-plans.repository-interface';
import { AdminSubscriptionPlanResponseMapper } from '../../response/subscription-plan/admin-subscription-plan-response.mapper';
import { AdminSubscriptionPlanResponseDto } from '../../response/subscription-plan/admin-subscription-plan-response.dto';

@Injectable()
export class AdminCreateSubscriptionPlanUseCase {
  constructor(
    @Inject(SUBSCRIPTION_PLANS_REPOSITORY)
    private readonly subscriptionPlanRepository: SubscriptionPlansRepositoryInterface,
    @Inject()
    private readonly isAdminValidator: IsAdminValidator
  ) {}

  async execute(adminPersonId: string, dto: CreateSubscriptionPlanDto): Promise<AdminSubscriptionPlanResponseDto> {
    const adminPerson = await this.isAdminValidator.validate(adminPersonId);
    const subscriptionPlan = SubscriptionPlansDomainEntity.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      durationInDays: dto.durationInDays,
      isActive: dto.isActive,
      createdBy: adminPerson
    });
    const result = await this.subscriptionPlanRepository.persist(subscriptionPlan);
    return AdminSubscriptionPlanResponseMapper.toResponse(result);
  }
}
