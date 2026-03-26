/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PERSON_REPOSITORY,
  type PersonRepositoryInterface
} from 'src/modules/person/domain/person.repository-interface';
import {
  SUBSCRIPTION_PLANS_REPOSITORY,
  type SubscriptionPlansRepositoryInterface
} from 'src/modules/subscription-plans/domain/subscription-plans.repository-interface';
import {
  SUBSCRIPTION_REPOSITORY,
  type SubscriptionRepositoryInterface
} from '../../domain/subscription.repository-interface';
import { SubscriptionDomainEntity } from '../../domain/subscription.domain-entity';
import { SubscriptionStatusEnum } from '../../domain/subscription-status.enum';
import axios from 'axios';
import { PaymentsDomainEntity } from 'src/modules/payments/domain/payments.domain-entity';
import { ProvidersEnum } from 'src/modules/payments/domain/providers.enum';
import { PaymentsStatusEnum } from 'src/modules/payments/domain/payments-status.enum';
import {
  PAYMENTS_REPOSITORY,
  type PaymentsRepositoryInterface
} from 'src/modules/payments/domain/payments.repository-interface';

@Injectable()
export class CreateSubscriptionUseCase {
  constructor(
    @Inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepositoryInterface,
    @Inject(SUBSCRIPTION_PLANS_REPOSITORY)
    private readonly subscriptionPlansRepository: SubscriptionPlansRepositoryInterface,
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: SubscriptionRepositoryInterface,
    @Inject(PAYMENTS_REPOSITORY)
    private readonly paymentsRepository: PaymentsRepositoryInterface
  ) {}

  async execute(personId: string, planId: string): Promise<any> {
    const person = await this.personRepository.findPersonById(personId);
    if (!person) {
      throw new NotFoundException(`Person não encotrado.`);
    }
    const plan = await this.subscriptionPlansRepository.findOne(planId);
    if (!plan) {
      throw new NotFoundException(`Subscription Plan não encontrado.`);
    }
    const existingSubscription = await this.subscriptionRepository.findActiveByPersonId(person.id);
    if (existingSubscription) {
      throw new ConflictException(`Usuário já é VIP`);
    }

    const subscription = SubscriptionDomainEntity.create({
      person,
      subscriptionPlanId: plan,
      status: SubscriptionStatusEnum.PENDING
    });

    await this.subscriptionRepository.persist(subscription);

    const mpAccessToken = process.env.MP_ACCESS_TOKEN;
    const mpResponse = await axios.post(
      'https://api.mercadopago.com/checkout/preferences',
      {
        items: [
          {
            title: plan.name,
            description: plan.description,
            quantity: 1,
            currency_id: 'BRL',
            unit_price: Number(plan.price)
          }
        ],
        payer: {
          email: 'test_user_123@testuser.com',
        },
        back_urls: {
          success: 'https://app.com/success',
          failure: 'https://app.com/failure',
          pending: 'https://app.com/pending'
        },
        auto_return: 'approved',
        metadata: {
          subscriptionId: subscription.id
        }
      },
      { headers: { Authorization: `Bearer ${mpAccessToken}` } }
    );

    const paymentLink = mpResponse.data.init_point;

    const payment = PaymentsDomainEntity.create({
      subscription: subscription,
      provider: ProvidersEnum.MERCADO_PAGO,
      externalSessionId: mpResponse.data.id,
      paymentUrl: paymentLink,
      amount: plan.price,
      currency: 'BRL',
      status: PaymentsStatusEnum.PENDING
    });
    await this.paymentsRepository.persist(payment);

    return {
      checkoutUrl: paymentLink,
      subscriptionId: subscription.id,
      paymentId: payment.id
    };
  }
}
