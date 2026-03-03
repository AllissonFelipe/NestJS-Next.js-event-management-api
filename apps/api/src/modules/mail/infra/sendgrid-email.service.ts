/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import sgMail from '@sendgrid/mail';
import { MailServiceInterface } from '../domain/mail-service.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendGridEmailService implements MailServiceInterface {
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.getOrThrow<string>('SENDGRID_API_KEY');
    console.log('SendGrid key carregada:', this.apiKey.startsWith('SG.'));
    sgMail.setApiKey(this.apiKey);
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
}
