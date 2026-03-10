import { EventsDomainEntity } from 'src/modules/events/domain/events.domain-entity';

/* eslint-disable prettier/prettier */
export const MAIL_SERVICE = Symbol('MAIL_SERVICE');

export interface MailServiceInterface {
    sendAccountActivationEmail(email: string, link: string): Promise<void>;
    sendResetEmailLink(email: string, link: string): Promise<void>;
    sendEventApprovedEmail(email: string, event: EventsDomainEntity): Promise<void>;
    sendResetPasswordEmail(to: string, resetPasswordLink: string): Promise<void>;
    sendEventRejectedEmail(to: string, event: EventsDomainEntity, reason?: string,): Promise<void>;
}