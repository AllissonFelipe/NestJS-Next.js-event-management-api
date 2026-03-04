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
import { appConfigSchema } from './config/config.types';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PersonProfileModule } from './modules/person-profile/person-profile.module';
import { EventsModule } from './modules/events/events.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AdminModule } from './modules/admin/admin.module';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { EventParticipantsModule } from './modules/event-participants/event-participants.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: TypedConfigService) => {
        const dbConfig = configService.get<TypeOrmModuleOptions>('database');
        return {
          ...dbConfig,
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
    EventParticipantsModule,
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
