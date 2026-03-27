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
    console.log('WEBHOOK BODY:', JSON.stringify(body, null, 2));

    if (body.type !== 'topic_merchant_order_wh') return;

    const merchantOrderId = body.id;

    if (!merchantOrderId) {
      console.warn('merchantOrderId não encontrado no webhook');
      return;
    }

    const orderResponse = await axios.get(`https://api.mercadopago.com/merchant_orders/${merchantOrderId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
      }
    });

    const order = orderResponse.data;
    console.log('ORDER COMPLETA:', JSON.stringify(order, null, 2));

    if (!order.payments || order.payments.length === 0) {
      console.warn('Pedido ainda sem pagamento');
      return;
    }

    const paymentId = order.payments[0]?.id;

    if (!paymentId) {
      console.warn('Nenhum pagamento encontrado no pedido');
      return;
    }

    const mpResponse = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
      }
    });

    const paymentData = mpResponse.data;
    const subscriptionId = paymentData.metadata?.subscriptionId || order.external_reference;

    if (!subscriptionId) {
      console.warn('Pagamento sem subscriptionId no metadata ou external_reference');
      return;
    }

    const payment = await this.paymentRepository.findBySubscriptionId(subscriptionId);
    if (!payment) {
      console.warn('HandlePaymentMercadoPagoUseCase - Payment não encontrado');
      throw new NotFoundException(`HandlePaymentMercadoPagoUseCase - Payment não encontrado`)
      return;
    }

    const statusMap = {
      approved: PaymentsStatusEnum.APPROVED,
      rejected: PaymentsStatusEnum.REJECTED,
      in_process: PaymentsStatusEnum.PENDING
    };
    const newStatus = statusMap[paymentData.status];
    if (payment.externalPaymentId === paymentId && payment.status === newStatus) {
      return;
    }

    payment.chageExternaPaymentId(paymentId);

    if (paymentData.status === 'approved') {
      payment.markAsPaid(new Date());
      const subscription = await this.subscriptionRepository.findById(subscriptionId);
      if (!subscription) {
        throw new NotFoundException(`Subscription não encontrada`);
      }
      const plan = await this.subscriptionPlanRepository.findOne(subscription.subscriptionPlanId);
      if (!plan) {
        throw new NotFoundException(`Subscription Plan não encontrado.`);
      }
      console.log('ANTES activate:', {
        status: subscription.status,
        isActive: subscription.isActive()
      });
      if (!subscription.isActive()) {
        subscription.activate(plan.durationInDays);
        await this.subscriptionRepository.persist(subscription);
      }
      console.log('DEPOIS activate:', {
        status: subscription.status,
        isActive: subscription.isActive()
      });
    }

    if (paymentData.status === 'rejected') {
      payment.changeStatus(PaymentsStatusEnum.REJECTED);
    }
    if (paymentData.status === 'in_process') {
      payment.changeStatus(PaymentsStatusEnum.PENDING);
    }

    await this.paymentRepository.persist(payment);
  }
}
