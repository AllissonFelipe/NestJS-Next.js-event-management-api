import { Module } from '@nestjs/common';
import { WebhookMercadoPagoController } from './mercado-pago/webhook-mercado-pago.controller';
import { HandlePaymentMercadoPagoUseCase } from './mercado-pago/handle-payment.usecase';
import { PaymentsModule } from '../payments/payments.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { SubscriptionPlansModule } from '../subscription-plans/subscription-plans.module';
import { TypeOrmUnitOfWork } from 'src/database/typeorm-unit-of-work';
import { UNIT_OF_WORK } from 'src/database/unit-of-work.interface';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [PaymentsModule, SubscriptionModule, SubscriptionPlansModule, MailModule],
  controllers: [WebhookMercadoPagoController],
  providers: [
    HandlePaymentMercadoPagoUseCase,
    {
      provide: UNIT_OF_WORK,
      useClass: TypeOrmUnitOfWork
    }
  ],
  exports: [HandlePaymentMercadoPagoUseCase]
})
export class WebhooksModule {}
