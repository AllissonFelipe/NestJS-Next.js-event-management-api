import { Module } from '@nestjs/common';
import { WebhookMercadoPagoController } from './mercado-pago/webhook-mercado-pago.controller';
import { HandlePaymentMercadoPagoUseCase } from './mercado-pago/handle-payment.usecase';
import { PaymentsModule } from '../payments/payments.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { SubscriptionPlansModule } from '../subscription-plans/subscription-plans.module';

@Module({
  imports: [PaymentsModule, SubscriptionModule, SubscriptionPlansModule],
  controllers: [WebhookMercadoPagoController],
  providers: [HandlePaymentMercadoPagoUseCase],
  exports: [HandlePaymentMercadoPagoUseCase]
})
export class WebhooksModule {}
