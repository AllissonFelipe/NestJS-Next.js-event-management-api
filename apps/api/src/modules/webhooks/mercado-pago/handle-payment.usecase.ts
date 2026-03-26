/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PAYMENTS_REPOSITORY,
  type PaymentsRepositoryInterface
} from 'src/modules/payments/domain/payments.repository-interface';
import axios from 'axios';
import { PaymentsStatusEnum } from 'src/modules/payments/domain/payments-status.enum';
import {
  SUBSCRIPTION_REPOSITORY,
  type SubscriptionRepositoryInterface
} from 'src/modules/subscription/domain/subscription.repository-interface';
import {
  SUBSCRIPTION_PLANS_REPOSITORY,
  type SubscriptionPlansRepositoryInterface
} from 'src/modules/subscription-plans/domain/subscription-plans.repository-interface';

@Injectable()
export class HandlePaymentMercadoPagoUseCase {
  constructor(
    @Inject(PAYMENTS_REPOSITORY)
    private readonly paymentRepository: PaymentsRepositoryInterface,
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: SubscriptionRepositoryInterface,
    @Inject(SUBSCRIPTION_PLANS_REPOSITORY)
    private readonly subscriptionPlanRepository: SubscriptionPlansRepositoryInterface
  ) {}

  async execute(body: any) {
    if (body.type !== 'topic_merchant_order_wh') return;

    const paymentId = body.data.id;

    const mpResponse = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
      }
    });

    const paymentData = mpResponse.data;
    const subscriptionId = paymentData.metadata?.subscriptionId;
    if (!subscriptionId) {
      console.warn('Pagamento sem subscriptionId no metadata');
      return;
    }

    const payment = await this.paymentRepository.findBySubscriptionId(subscriptionId);

    if (!payment) return;

    const statusMap = {
      approved: PaymentsStatusEnum.APPROVED,
      rejected: PaymentsStatusEnum.REJECTED,
      pending: PaymentsStatusEnum.PENDING
    };
    const newStatus = statusMap[paymentData.status];
    if (payment.externalPaymentId === paymentId && payment.status === newStatus) {
      return;
    }

    payment.chageExternaPaymentId(paymentId);

    if (paymentData.status === 'approved') {
      payment.changeStatus(PaymentsStatusEnum.APPROVED);
      const subscription = await this.subscriptionRepository.findById(subscriptionId);
      if (!subscription) {
        throw new NotFoundException(`Subscription não encontrada`);
      }
      const plan = await this.subscriptionPlanRepository.findOne(subscription.subscriptionPlanId);
      if (!plan) {
        throw new NotFoundException(`Subscription Plan não encontrado.`);
      }
      if (!subscription.isActive()) {
        subscription.activate(plan.durationInDays);
        await this.subscriptionRepository.persist(subscription);
      }
    }

    if (paymentData.status === 'rejected') {
      payment.changeStatus(PaymentsStatusEnum.REJECTED);
    }
    if (paymentData.status === 'pending') {
      payment.changeStatus(PaymentsStatusEnum.PENDING);
    }

    await this.paymentRepository.persist(payment);
  }
}
