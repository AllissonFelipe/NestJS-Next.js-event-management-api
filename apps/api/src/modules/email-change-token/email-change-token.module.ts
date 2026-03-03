import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailChangeTokenOrmEntity } from './infra/email-change-token.orm-entity';
import { EMAIL_CHANGE_TOKEN_REPOSITORY } from './domain/email-change-token.repository-interface';
import { EmailChangeTokenRepositoryTypeOrm } from './infra/email-change-token.repository-typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EmailChangeTokenOrmEntity])],
  controllers: [],
  providers: [
    {
      provide: EMAIL_CHANGE_TOKEN_REPOSITORY,
      useClass: EmailChangeTokenRepositoryTypeOrm,
    },
  ],
  exports: [EMAIL_CHANGE_TOKEN_REPOSITORY],
})
export class EmailChangeTokenModule {}
