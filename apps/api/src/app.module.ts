/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './database/database.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypedConfigService } from './config/typed-config.service';
import { authConfig } from './config/auth.config';
import { PersonModule } from './modules/person/person.module';
import { PersonRoleModule } from './modules/person-role/person-role.module';
import { PersonOrmEntity } from './modules/person/infra/person.orm-entity';
import { appConfigSchema } from './config/config.types';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PersonRoleOrmEntity } from './modules/person-role/infra/person-role.orm-entity';
import { PersonProfileModule } from './modules/person-profile/person-profile.module';
import { PersonProfileOrmEntity } from './modules/person-profile/infra/person-profile.orm-entity';
import { EventsOrmEntity } from './modules/events/infra/events.orm-entity';
import { EventsModule } from './modules/events/events.module';
import { EventsImagesOrmEntity } from './modules/events/events-images/infra/events-images.orm-entity';
import { EventsAddressesOrmEntity } from './modules/events/events-addresses/infra/events-addresses.orm-entity';
import { AuthModule } from './modules/auth/auth.module';
import { AccountActivationTokenOrmEntity } from './modules/account-activation-token/infra/account-activation-token.orm-entity';
import { PasswordResetTokenOrmEntity } from './modules/password-reset-token/infra/password-reset-token.orm-entity';
import { UserModule } from './modules/user/user.module';
import { EmailChangeTokenOrmEntity } from './modules/email-change-token/infra/email-change-token.orm-entity';
import { AdminModule } from './modules/admin/admin.module';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { EventParticipantsOrmEntity } from './modules/event-participants/infra/event-participants.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: TypedConfigService) => {
        const dbConfig = configService.get<TypeOrmModuleOptions>('database');
        return {
          ...dbConfig,
          entities: [PersonOrmEntity, AccountActivationTokenOrmEntity, PasswordResetTokenOrmEntity, PersonRoleOrmEntity, PersonProfileOrmEntity, EventsOrmEntity, EventsImagesOrmEntity, EventsAddressesOrmEntity, EmailChangeTokenOrmEntity, EventParticipantsOrmEntity],
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig, authConfig],
      validationSchema: appConfigSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 5,
      },
    ]),
    AuthModule,
    PersonModule,
    PersonRoleModule,
    PersonProfileModule,
    EventsModule,
    UserModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    JwtService,
    AppService,
    {
      provide: TypedConfigService,
      useExisting: ConfigService,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}