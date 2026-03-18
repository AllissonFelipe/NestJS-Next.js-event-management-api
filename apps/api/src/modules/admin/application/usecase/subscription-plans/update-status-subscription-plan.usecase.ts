import { Inject, Injectable } from '@nestjs/common';
import { AdminSubscriptionPlanResponseDto } from '../../response/subscription-plan/admin-subscription-plan-response.dto';
import { IsAdminValidator } from '../../validators/is-admin.validator';
import {
  SUBSCRIPTION_PLANS_REPOSITORY,
  type SubscriptionPlansRepositoryInterface,
} from 'src/modules/subscription-plans/domain/subscription-plans.repository-interface';
import { AdminSubscriptionPlanNotFoundError } from 'src/modules/admin/domain/errors/admin-subscription-plan-not-found.error';
import { AdminSubscriptionPlanAlreadyActivateError } from 'src/modules/admin/domain/errors/admin-subscription-plan-already-activate.error';
import { AdminSubscriptionPlanResponseMapper } from '../../response/subscription-plan/admin-subscription-plan-response.mapper';
import { AdminSubscriptionPlanAlreadyDeactivateError } from 'src/modules/admin/domain/errors/admin-subscription-plan-already-deactivate.error';

@Injectable()
export class AdminUpdateStatusSubscriptionPlanUseCase {
  constructor(
    @Inject()
    private readonly isAdminValidator: IsAdminValidator,
    @Inject(SUBSCRIPTION_PLANS_REPOSITORY)
    private readonly subscriptionPlanRepository: SubscriptionPlansRepositoryInterface,
  ) {}

  async executeActivate(
    adminPersonId: string,
    subscriptionPlanId: string,
  ): Promise<AdminSubscriptionPlanResponseDto> {
    await this.isAdminValidator.validate(adminPersonId);
    const subscriptionPlan =
      await this.subscriptionPlanRepository.findOne(subscriptionPlanId);
    if (!subscriptionPlan) {
      throw new AdminSubscriptionPlanNotFoundError();
    }
    if (subscriptionPlan.isActive === true) {
      throw new AdminSubscriptionPlanAlreadyActivateError();
    }
    subscriptionPlan.activate();
    const result =
      await this.subscriptionPlanRepository.persist(subscriptionPlan);
    return AdminSubscriptionPlanResponseMapper.toResponse(result);
  }

  async executeDeactivate(
    adminPersonId: string,
    subscriptionPlanId: string,
  ): Promise<AdminSubscriptionPlanResponseDto> {
    await this.isAdminValidator.validate(adminPersonId);
    const subscriptionPlan =
      await this.subscriptionPlanRepository.findOne(subscriptionPlanId);
    if (!subscriptionPlan) {
      throw new AdminSubscriptionPlanNotFoundError();
    }
    if (subscriptionPlan.isActive === false) {
      throw new AdminSubscriptionPlanAlreadyDeactivateError();
    }
    subscriptionPlan.deactivate();
    const result =
      await this.subscriptionPlanRepository.persist(subscriptionPlan);
    return AdminSubscriptionPlanResponseMapper.toResponse(result);
  }
}
