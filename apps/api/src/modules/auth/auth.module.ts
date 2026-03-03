import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { AuthConfig } from 'src/config/auth.config';
import { AuthController } from './auth.controller';
import { PersonModule } from '../person/person.module';
import { MailModule } from '../mail/mail.module';
import { PersonRoleModule } from '../person-role/person-role.module';
import { PersonProfileModule } from '../person-profile/person-profile.module';
import { CreateAccountUseCase } from './application/create-account/create-account.usecase';
import { EmailAndCpfValidator } from './application/create-account/email-and-cpf-validator';
import { PASSWORD_HASHER } from './application/create-account/password-hasher.interface';
import { BcryptPasswordHasher } from './infra/bcrypt-password-hasher';
import { UNIT_OF_WORK } from 'src/database/unit-of-work.interface';
import { TypeOrmUnitOfWork } from 'src/database/typeorm-unit-of-work';
import { AccountActivationTokenModule } from '../account-activation-token/account-activation-token.module';
import { ActivateAccountUseCase } from './application/activate-account/activate-account.usecase';
import { ForgotPasswordUseCase } from './application/password-reset/forgot-password.usecase';
import { PasswordResetTokenModule } from '../password-reset-token/password-reset-token.module';
import { ResetPasswordUseCase } from './application/password-reset/reset-password.usecase';
import { LoginAccountUseCase } from './application/login-account/login-account.usecase';

@Module({
  imports: [
    PersonModule,
    PersonRoleModule,
    PersonProfileModule,
    AccountActivationTokenModule,
    PasswordResetTokenModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const authConfig: AuthConfig = {
          jwt: {
            secret: configService.get<string>('JWT_SECRET')!,
            expiresIn: configService.get<string>(
              'JWT_EXPIRES_IN',
            ) as StringValue,
          },
        };
        return {
          secret: authConfig.jwt.secret,
          signOptions: { expiresIn: authConfig.jwt.expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    CreateAccountUseCase,
    ActivateAccountUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    LoginAccountUseCase,
    EmailAndCpfValidator,
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: UNIT_OF_WORK,
      useClass: TypeOrmUnitOfWork,
    },
  ],
  exports: [],
})
export class AuthModule {}
