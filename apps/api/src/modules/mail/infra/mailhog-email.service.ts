/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailServiceInterface } from '../domain/mail-service.interface';

@Injectable()
export class MailHogEmailService implements MailServiceInterface {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAILHOG_HOST', 'localhost'),
      port: this.configService.get('MAILHOG_PORT', 1025),
      secure: false,
    });

    console.log('📧 MailHog configurado');
  }
  async sendResetEmailLink(to: string, activationLink: string): Promise<void> {
    await this.transporter.sendMail({
      from: '"Enova Educacional" <no-reply@enovaeducacional.com>',
      to,
      subject: 'Mude seu email',
      html: `
        <p>Olá!</p>
        <p>Clique no link para mudar o seu email:</p>
        <a href="${activationLink}">${activationLink}</a>
      `,
    });
  }

  async sendAccountActivationEmail(
    to: string,
    activationLink: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: '"Enova Educacional" <no-reply@enovaeducacional.com>',
      to,
      subject: 'Ative sua conta',
      html: `
        <p>Olá!</p>
        <p>Clique no link para ativar sua conta:</p>
        <a href="${activationLink}">${activationLink}</a>
      `,
    });
  }
}
