/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { PersonExceptionFilter } from './shared/filters/person-exception.filter';
import { AccountActivationTokenExceptionFilter } from './shared/filters/account-activation-token-exception.filter';
import { PasswordResetTokenExceptionFilter } from './shared/filters/password-reset-token-exception.filter';
import { EventsExceptionFilter } from './shared/filters/events-exception.filter';
import { SharedExceptionFilter } from './shared/filters/shared-exception.filter';
import { UserExceptionFilter } from './shared/filters/user-exception.filter';
import { EmailChageTokenExceptionFilter } from './shared/filters/email-change-token-exception.filter';
import { AdminExceptionFilter } from './shared/filters/admin-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    validationError: {
      target: false,
      value: false,
    },
    exceptionFactory: (errors) => {
      console.log(errors);
      const messages = errors
        .map(err => Object.values(err.constraints ?? {}))
        .flat();
      return new BadRequestException(messages);
    },
  }));
  app.enableCors({
    origin: 'http://localhost:5555', // Porta do Next.js
    methods: 'GET,POST,PUT,DELETE',
  });
  app.useGlobalFilters(new PersonExceptionFilter(), new AccountActivationTokenExceptionFilter(), new PasswordResetTokenExceptionFilter(), new EventsExceptionFilter(), new SharedExceptionFilter(), new UserExceptionFilter(), new EmailChageTokenExceptionFilter(), new AdminExceptionFilter());
  
  await app.listen(3000);

  console.log('🚀 Backend rodando em http://localhost:3000');
  console.log('SENDGRID:', process.env.SENDGRID_API_KEY ? 'OK' : 'NOK');
}
bootstrap().catch(err => {
  console.error(`Erro ao iniciar o app`, err);
});