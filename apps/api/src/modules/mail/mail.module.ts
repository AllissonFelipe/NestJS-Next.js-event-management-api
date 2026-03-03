import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MAIL_SERVICE } from './domain/mail-service.interface';
import { MailHogEmailService } from './infra/mailhog-email.service';
import { SendGridEmailService } from './infra/sendgrid-email.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: MAIL_SERVICE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const provider = configService.get<string>('MAIL_PROVIDER');

        if (provider === 'sendgrid') {
          return new SendGridEmailService(configService);
        }

        // default: dev
        return new MailHogEmailService(configService);
      },
    },
  ],
  exports: [MAIL_SERVICE],
})
export class MailModule {}
