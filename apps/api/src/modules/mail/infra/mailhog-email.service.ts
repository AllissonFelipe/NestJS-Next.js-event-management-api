/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailServiceInterface } from '../domain/mail-service.interface';
import { EventsDomainEntity } from 'src/modules/events/domain/events.domain-entity';

@Injectable()
export class MailHogEmailService implements MailServiceInterface {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAILHOG_HOST', 'localhost'),
      port: this.configService.get('MAILHOG_PORT', 1025),
      secure: false
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
      `
    });
  }

  async sendAccountActivationEmail(to: string, activationLink: string): Promise<void> {
    await this.transporter.sendMail({
      from: '"Enova Educacional" <no-reply@enovaeducacional.com>',
      to,
      subject: 'Ative sua conta',
      html: `
        <p>Olá!</p>
        <p>Clique no link para ativar sua conta:</p>
        <a href="${activationLink}">${activationLink}</a>
      `
    });
  }

  async sendResetPasswordEmail(to: string, resetPasswordLink: string): Promise<void> {
    await this.transporter.sendMail({
      from: '"Enova Educacional" <no-reply@enovaeducacional.com>',
      to,
      subject: 'New Password',
      html: `
        <p>Olá!</p>
        <p>Clique no link para mudar a senha da sua conta:</p>
        <a href="${resetPasswordLink}">${resetPasswordLink}</a>
      `
    });
  }

  async sendEventApprovedEmail(to: string, event: EventsDomainEntity): Promise<void> {
    const formattedDate = new Date(event.startAt).toLocaleString('pt-BR');
    const eventUrl = `http://localhost:3000/events/${event.id}`;
    const address = `${event.address.street}, ${event.address.number} - ${event.address.neighborhood}<br>
    ${event.address.city}/${event.address.state} - CEP: ${event.address.zipCode}`;

    const payload = {
      from: '"Enova Educacional" <no-reply@enovaeducacional.com>',
      to,
      subject: `Seu evento "${event.title}" foi aprovado 🎉`,
      text: `
        Olá!

        Seu evento "${event.title}" foi aprovado e agora está visível para outros usuários.

        Detalhes do evento:
        Título: ${event.title}
        Data: ${formattedDate}
        <p><strong>Local:</strong><br/>
        ${event.address.street}, ${event.address.number} - ${event.address.neighborhood}<br/>
        ${event.address.city}/${event.address.state} - CEP: ${event.address.zipCode}
        </p>

        Agora outros usuários já podem visualizar e participar do seu evento.

        Obrigado por usar nossa plataforma!
      `,
      html: `
        <div style="font-family: Arial, sans-serif; background:#f5f6fa; padding:30px;">
          
          <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:10px;">
            
            <h2 style="color:#2f80ed;">🎉 Seu evento foi aprovado!</h2>

            <p>Olá,</p>

            <p>
              Seu evento <strong>${event.title}</strong> foi aprovado pela nossa equipe 
              e agora está disponível na plataforma.
            </p>

            <div style="background:#f1f3f5; padding:20px; border-radius:8px; margin-top:20px;">
              <h3 style="margin-top:0;">📅 Detalhes do evento</h3>

              <p><strong>Título:</strong> ${event.title}</p>
              <p><strong>Data:</strong> ${formattedDate}</p>
              <p><strong>Local:</strong> ${address}</p>
            </div>

            <p style="margin-top:25px;">
              Agora outros usuários já podem visualizar e participar do seu evento.
            </p>

            <div style="text-align:center; margin-top:30px;">
              <a href="${eventUrl}" 
                style="
                  background:#2f80ed;
                  color:white;
                  padding:14px 28px;
                  text-decoration:none;
                  border-radius:6px;
                  font-weight:bold;
                  display:inline-block;
                "
              >
                🔎 Ver evento
              </a>
            </div>

            <p>
              Obrigado por usar nossa plataforma 🚀
            </p>

            <hr style="margin:30px 0"/>

            <p style="font-size:12px; color:#777;">
              Enova Educacional • Plataforma de Eventos
            </p>

          </div>
        </div>
      `
    };

    await this.transporter.sendMail(payload);
  }

  async sendEventRejectedEmail(
    to: string,
    event: EventsDomainEntity,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reason?: string
  ): Promise<void> {
    const formattedDate = new Date(event.createdAt).toLocaleString('pt-BR');
    const address = `${event.address.street}, ${event.address.number} - ${event.address.neighborhood}<br>${event.address.city}/${event.address.state} - CEP: ${event.address.zipCode}`;
    const payload = {
      from: '"Enova Educacional" <no-reply@enovaeducacional.com>',
      to,
      subject: `⚠️ Seu evento "${event.title}" não foi aprovado`,
      text: `
        Olá,

        Infelizmente seu evento "${event.title}" não foi aprovado pela nossa equipe de moderação.

        📅 Detalhes do evento
        Título: ${event.title}
        Data: ${formattedDate}
        Local: ${address}

        Isso pode ter ocorrido por não atender a alguma das diretrizes da plataforma.

        Você pode revisar as informações do evento e enviá-lo novamente para análise.

        Se tiver dúvidas, entre em contato com nossa equipe de suporte.

        Obrigado por usar nossa plataforma.
        Enova Educacional
      `,
      html: `
        <div style="font-family: Arial, sans-serif; background:#f5f6fa; padding:30px;">
          <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:10px;">
            
            <h2 style="color:#e74c3c;">⚠️ Evento não aprovado</h2>

            <p>Olá,</p>

            <p>
              Após análise da nossa equipe, infelizmente o evento
              <strong>${event.title}</strong> não foi aprovado para publicação
              na plataforma neste momento.
            </p>

            <div style="background:#f8f9fa; padding:20px; border-radius:8px; margin-top:20px;">
              <h3 style="margin-top:0;">📅 Detalhes do evento</h3>

              <p><strong>Título:</strong> ${event.title}</p>
              <p><strong>Data:</strong> ${formattedDate}</p>
              <p><strong>Local:</strong><br/>${address.replace('\n', '<br/>')}</p>
            </div>

            <p style="margin-top:20px;">
              Isso pode ter ocorrido por não atender a alguma das diretrizes da plataforma.
              Você pode revisar as informações do evento e enviá-lo novamente para análise.
            </p>

            <p>
              Caso tenha dúvidas, nossa equipe estará disponível para ajudar.
            </p>

            <p>Obrigado por usar nossa plataforma.</p>

            <hr style="margin:30px 0"/>

            <p style="font-size:12px; color:#777;">
              Enova Educacional • Plataforma de Eventos
            </p>
          </div>
        </div>
      `
    };
    await this.transporter.sendMail(payload);
  }
}
