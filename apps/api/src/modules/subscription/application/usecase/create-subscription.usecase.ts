import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SubscriptionPlanResponseDto } from '../response/subscription-plan-response.dto';
import {
  PERSON_REPOSITORY,
  type PersonRepositoryInterface,
} from 'src/modules/person/domain/person.repository-interface';
import {
  SUBSCRIPTION_PLANS_REPOSITORY,
  type SubscriptionPlansRepositoryInterface,
} from 'src/modules/subscription-plans/domain/subscription-plans.repository-interface';

@Injectable()
export class CreateSubscriptionUseCase {
  constructor(
    @Inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepositoryInterface,
    @Inject(SUBSCRIPTION_PLANS_REPOSITORY)
    private readonly subscriptionPlansRepository: SubscriptionPlansRepositoryInterface,
  ) {}

  async execute(personId: string, planId: string): Promise<SubscriptionPlanResponseDto> {
    const person = await this.personRepository.findPersonById(personId);
    if (!person) {
      throw new NotFoundException(`Person não encotrado.`);
    }
    const plan = await this.subscriptionPlansRepository.findOne(planId);
    if (!plan) {
      throw new NotFoundException(`Subscription Plan não encontrado.`);
    }

    throw new Error(`Parando retorno`);
  }
}
