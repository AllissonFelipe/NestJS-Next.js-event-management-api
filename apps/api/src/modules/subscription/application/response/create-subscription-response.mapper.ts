import { PaymentsDomainEntity } from "src/modules/payments/domain/payments.domain-entity";
import { SubscriptionPlansDomainEntity } from "src/modules/subscription-plans/domain/subscription-plans.domain-entity";
import { CreateSubscriptionResponseDto } from "./create-subscription-response.dto";

export class CreateSubscriptionResponseMapper {
    static toResponse(payment: PaymentsDomainEntity, subscriptionPlan: SubscriptionPlansDomainEntity): CreateSubscriptionResponseDto {
        return {
            subscription: {
                payment: {
                    id: payment.id,
                    provider: payment.provider,
                    externalSessionId: payment.externalSessionId,
                    paymentUrl: payment.paymentUrl,
                    amount: payment.amount,
                    currency: payment.currency,
                    status: payment.status,
                },
                subscriptionPlan: {
                    id: subscriptionPlan.id,
                    name: subscriptionPlan.name,
                    description: subscriptionPlan.description,
                    durationInDays: subscriptionPlan.durationInDays
                }
            }
        }
    }
}