import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountActivationTokenOrmEntity } from './infra/account-activation-token.orm-entity';
import { Module } from '@nestjs/common';
import { ACCOUNT_ACTIVATION_TOKEN } from './domain/account-activation-token.repository-interface';
import { AccountActivationTokenRepositoryTypeOrm } from './infra/account-activation-token.repository-typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AccountActivationTokenOrmEntity])],
  providers: [
    {
      provide: ACCOUNT_ACTIVATION_TOKEN,
      useClass: AccountActivationTokenRepositoryTypeOrm,
    },
  ],
  exports: [ACCOUNT_ACTIVATION_TOKEN],
})
export class AccountActivationTokenModule {}
