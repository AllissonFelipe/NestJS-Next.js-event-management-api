import { EventsDomainEntity } from 'src/modules/events/domain/events.domain-entity';
import { PaymentsDomainEntity } from 'src/modules/payments/domain/payments.domain-entity';
import { CreateSubscriptionResponseDto } from 'src/modules/subscription/application/response/create-subscription-response.dto';

export const MAIL_SERVICE = Symbol('MAIL_SERVICE');

export interface MailServiceInterface {
  sendAccountActivationEmail(email: string, link: string): Promise<void>;
  sendResetEmailLink(email: string, link: string): Promise<void>;
  sendEventApprovedEmail(email: string, event: EventsDomainEntity): Promise<void>;
  sendResetPasswordEmail(to: string, resetPasswordLink: string): Promise<void>;
  sendEventRejectedEmail(to: string, event: EventsDomainEntity, reason?: string): Promise<void>;
  sendCreateSubscriptionEmail(to: string, obj: CreateSubscriptionResponseDto): Promise<void>;
  sendPaidSubscriptionEmail(to: string, payment: PaymentsDomainEntity): Promise<void>;
}
