import { Inject, Injectable } from '@nestjs/common';
import { AdminSubscriptionPlanResponseDto } from '../../response/subscription-plan/admin-subscription-plan-response.dto';
import { UpdateSubscriptionPlanDto } from '../../dtos/update-subscription-plan.dto';
import { IsAdminValidator } from '../../validators/is-admin.validator';
import {
  SUBSCRIPTION_PLANS_REPOSITORY,
  type SubscriptionPlansRepositoryInterface
} from 'src/modules/subscription-plans/domain/subscription-plans.repository-interface';
import { AdminSubscriptionPlanNotFoundError } from 'src/modules/admin/domain/errors/admin-subscription-plan-not-found.error';
import { AdminSubscriptionPlanResponseMapper } from '../../response/subscription-plan/admin-subscription-plan-response.mapper';

@Injectable()
export class AdminUpdateSubscriptionPlanUseCase {
  constructor(
    @Inject()
    private readonly isAdminValidator: IsAdminValidator,
    @Inject(SUBSCRIPTION_PLANS_REPOSITORY)
    private readonly subscriptionPlanRepository: SubscriptionPlansRepositoryInterface
  ) {}

  async execute(
    adminPersonId: string,
    subscriptionPlanId: string,
    dto: UpdateSubscriptionPlanDto
  ): Promise<AdminSubscriptionPlanResponseDto> {
    await this.isAdminValidator.validate(adminPersonId);
    const subscriptionPlan = await this.subscriptionPlanRepository.findOne(subscriptionPlanId);
    if (!subscriptionPlan) {
      throw new AdminSubscriptionPlanNotFoundError();
    }
    subscriptionPlan.update(dto);
    const result = await this.subscriptionPlanRepository.persist(subscriptionPlan);
    return AdminSubscriptionPlanResponseMapper.toResponse(result);
  }
}
