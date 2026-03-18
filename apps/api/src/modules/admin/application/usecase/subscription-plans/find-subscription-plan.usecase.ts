import { Inject, Injectable } from '@nestjs/common';
import { IsAdminValidator } from '../../validators/is-admin.validator';
import {
  SUBSCRIPTION_PLANS_REPOSITORY,
  type SubscriptionPlansRepositoryInterface,
} from 'src/modules/subscription-plans/domain/subscription-plans.repository-interface';
import { AdminSubscriptionPlanResponseDto } from '../../response/subscription-plan/admin-subscription-plan-response.dto';
import { AdminSubscriptionPlanResponseMapper } from '../../response/subscription-plan/admin-subscription-plan-response.mapper';
import { AdminSubscriptionPlanNotFoundError } from 'src/modules/admin/domain/errors/admin-subscription-plan-not-found.error';

@Injectable()
export class AdminFindSubscriptionPlanUseCase {
  constructor(
    @Inject()
    private readonly isAdminValidator: IsAdminValidator,
    @Inject(SUBSCRIPTION_PLANS_REPOSITORY)
    private readonly subscriptionPlanRepository: SubscriptionPlansRepositoryInterface,
  ) {}

  async executeFindAll(
    adminPersonId: string,
  ): Promise<AdminSubscriptionPlanResponseDto[]> {
    await this.isAdminValidator.validate(adminPersonId);
    const subscriptionPlans = await this.subscriptionPlanRepository.findAll();
    return subscriptionPlans.map((entity) =>
      AdminSubscriptionPlanResponseMapper.toResponse(entity),
    );
  }

  async executeFindOne(adminPersonId: string, subscriptionPlanId: string): Promise<AdminSubscriptionPlanResponseDto> {
    await this.isAdminValidator.validate(adminPersonId);
    const subscriptionPlan = await this.subscriptionPlanRepository.findOne(subscriptionPlanId);
    if (!subscriptionPlan) {
      throw new AdminSubscriptionPlanNotFoundError();
    }
    return AdminSubscriptionPlanResponseMapper.toResponse(subscriptionPlan);
  }
}
