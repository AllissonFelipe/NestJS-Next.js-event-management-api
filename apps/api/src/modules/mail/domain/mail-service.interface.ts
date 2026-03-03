/* eslint-disable prettier/prettier */
export const MAIL_SERVICE = Symbol('MAIL_SERVICE');

export interface MailServiceInterface {
    sendAccountActivationEmail(email: string, link: string): Promise<void>;
    sendResetEmailLink(email: string, link: string): Promise<void>;
}