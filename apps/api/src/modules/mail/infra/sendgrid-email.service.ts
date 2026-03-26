/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import sgMail from '@sendgrid/mail';
import { MailServiceInterface } from '../domain/mail-service.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventsDomainEntity } from 'src/modules/events/domain/events.domain-entity';

@Injectable()
export class SendGridEmailService implements MailServiceInterface {
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.getOrThrow<string>('SENDGRID_API_KEY');
    console.log('SendGrid key carregada:', this.apiKey.startsWith('SG.'));
    sgMail.setApiKey(this.apiKey);
  }
  sendEventRejectedEmail(to: string, event: EventsDomainEntity, reason?: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  sendResetPasswordEmail(to: string, resetPasswordLink: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async sendResetEmailLink(to: string, activationLink: string) {
    try {
      await sgMail.send({
        to,
        from: 'alissondev@enovaeducacional.com',
        subject: 'Mude seu email',
        html: `
                <p>Olá!</p>
                <p>Clique no link para mudar o seu email:</p>
                <a href="${activationLink}">${activationLink}</a>
            `,
      });
    } catch (error) {
      console.error('Erro ao enviar email SendGrid:', error.response?.body || error);
      throw error;
    }
  }

  async sendAccountActivationEmail(to, activationLink) {
    try {
      await sgMail.send({
        to,
        from: 'alissondev@enovaeducacional.com',
        subject: 'Ative sua conta',
        html: `
                <p>Olá!</p>
                <p>Clique no link para ativar sua conta:</p>
                <a href="${activationLink}">${activationLink}</a>
            `,
      });
    } catch (error) {
      console.error('Erro ao enviar email SendGrid:', error.response?.body || error);
      throw error;
    }
  }

  async sendEventApprovedEmail(email: string, event: EventsDomainEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
