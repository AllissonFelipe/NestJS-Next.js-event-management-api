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
import { UNIT_OF_WORK } from 'src/database/unit-of-work.interface';
import { TypeOrmUnitOfWork } from 'src/database/typeorm-unit-of-work';
import { CreateSubscriptionResponseMapper } from '../response/create-subscription-response.mapper';

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
    private readonly paymentsRepository: PaymentsRepositoryInterface,
    @Inject(UNIT_OF_WORK)
    private readonly uow: TypeOrmUnitOfWork
  ) {}

  async execute(personId: string, planId: string): Promise<any> {
    const result = await this.uow.execute(async (manager) => {
      const person = await this.personRepository.findPersonById(personId, manager);
      if (!person) {
        throw new NotFoundException(`Person não encotrado.`);
      }
      const plan = await this.subscriptionPlansRepository.findOne(planId, manager);
      if (!plan) {
        throw new NotFoundException(`Subscription Plan não encontrado.`);
      }
      const existingSubscription = await this.subscriptionRepository.findActiveByPersonId(person.id, manager);
      if (existingSubscription?.isActive()) {
        throw new ConflictException(`Usuário já é VIP`);
      }

      const subscription = SubscriptionDomainEntity.create({
        person,
        subscriptionPlanId: plan,
        status: SubscriptionStatusEnum.PENDING
      });

      await this.subscriptionRepository.persist(subscription, manager);
      const managedSubscription = await this.subscriptionRepository.findById(subscription.id, manager);
      if (!managedSubscription) {
        throw new NotFoundException(`Subscription persistida não encotrado.`);
      }

      const mpAccessToken = process.env.MP_ACCESS_TOKEN;
      const mpResponse = await axios.post(
        'https://api.mercadopago.com/checkout/preferences',
        {
          items: [
            {
              id: plan.id,
              title: plan.name,
              description: plan.description,
              quantity: 1,
              currency_id: 'BRL',
              unit_price: Number(plan.price)
            }
          ],
          payer: {
            id: person.id,
            name: person.fullName,
            email: person.email,
          },
          back_urls: {
            success: 'https://app.com/success',
            failure: 'https://app.com/failure',
            pending: 'https://app.com/pending'
          },
          auto_return: 'approved',
          metadata: {
            subscriptionId: subscription.id
          },
          external_reference: subscription.id,
        },
        { headers: { Authorization: `Bearer ${mpAccessToken}` } }
      );

      const paymentLink = mpResponse.data.init_point;

      const payment = PaymentsDomainEntity.create({
        subscription: managedSubscription,
        provider: ProvidersEnum.MERCADO_PAGO,
        externalSessionId: mpResponse.data.id,
        paymentUrl: paymentLink,
        amount: plan.price,
        currency: 'BRL',
        status: PaymentsStatusEnum.PENDING
      });
      await this.paymentsRepository.persist(payment, manager);

      return {
        checkoutUrl: paymentLink,
        subscription: managedSubscription,
        payment: payment,
        plan,
      };
    });
    return CreateSubscriptionResponseMapper.toResponse(result.payment, result.plan)
  }
}
