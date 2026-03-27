import { PaymentsStatusEnum } from "src/modules/payments/domain/payments-status.enum";
import { ProvidersEnum } from "src/modules/payments/domain/providers.enum";

export interface CreateSubscriptionResponseDto {
    subscription: {
        payment: Payment;
        subscriptionPlan: SubscriptionPlan;
    }
}
interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    durationInDays: number;
}
interface Payment {
    id: string;
    provider: ProvidersEnum;
    externalSessionId?: string;
    paymentUrl?: string;
    amount: number;
    currency: string;
    status: PaymentsStatusEnum;
}