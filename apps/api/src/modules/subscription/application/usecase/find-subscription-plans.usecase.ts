import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SubscriptionPlanResponseDto } from '../response/subscription-plan-response.dto';
import {
  SUBSCRIPTION_PLANS_REPOSITORY,
  type SubscriptionPlansRepositoryInterface
} from 'src/modules/subscription-plans/domain/subscription-plans.repository-interface';
import { SubscriptionPlanResponseMapper } from '../response/subscription-plan-response.mapper';

@Injectable()
export class FindSubscriptionPlansUseCase {
  constructor(
    @Inject(SUBSCRIPTION_PLANS_REPOSITORY)
    private readonly subscriptionPlanRepository: SubscriptionPlansRepositoryInterface
  ) {}

  async executeFindAll(): Promise<SubscriptionPlanResponseDto[]> {
    const plans = await this.subscriptionPlanRepository.findAll();
    return plans.map((plan) => SubscriptionPlanResponseMapper.toResponse(plan));
  }

  async executeFindOne(planId: string): Promise<SubscriptionPlanResponseDto> {
    const plan = await this.subscriptionPlanRepository.findOne(planId);
    if (!plan) {
      throw new NotFoundException(``);
    }
    return SubscriptionPlanResponseMapper.toResponse(plan);
  }
}
