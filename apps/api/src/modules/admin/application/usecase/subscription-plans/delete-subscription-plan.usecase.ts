import { Inject, Injectable } from '@nestjs/common';
import { IsAdminValidator } from '../../validators/is-admin.validator';
import {
  SUBSCRIPTION_PLANS_REPOSITORY,
  type SubscriptionPlansRepositoryInterface
} from 'src/modules/subscription-plans/domain/subscription-plans.repository-interface';
import { AdminSubscriptionPlanNotFoundError } from 'src/modules/admin/domain/errors/admin-subscription-plan-not-found.error';

@Injectable()
export class AdminDeleteSubscriptionPlanUseCase {
  constructor(
    @Inject(SUBSCRIPTION_PLANS_REPOSITORY)
    private readonly subscriptionPlanRepository: SubscriptionPlansRepositoryInterface,
    @Inject()
    private readonly isAdminValidator: IsAdminValidator
  ) {}

  async execute(adminPersonId: string, subscriptionPlanId: string): Promise<void> {
    await this.isAdminValidator.validate(adminPersonId);
    const subscriptionPlan = await this.subscriptionPlanRepository.findOne(subscriptionPlanId);
    if (!subscriptionPlan) {
      throw new AdminSubscriptionPlanNotFoundError();
    }
    await this.subscriptionPlanRepository.delete(subscriptionPlan.id);
  }
}
