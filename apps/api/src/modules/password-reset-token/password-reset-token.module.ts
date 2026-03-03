import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetTokenOrmEntity } from './infra/password-reset-token.orm-entity';

import { PASSWORD_RESET_TOKEN } from './domain/password-reset-token.repository-interface';
import { PasswordResetTokenRepositoryTypeOrm } from './infra/password-reset-token.repository-typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordResetTokenOrmEntity])],
  controllers: [],
  providers: [
    {
      provide: PASSWORD_RESET_TOKEN,
      useClass: PasswordResetTokenRepositoryTypeOrm,
    },
  ],
  exports: [PASSWORD_RESET_TOKEN],
})
export class PasswordResetTokenModule {}
