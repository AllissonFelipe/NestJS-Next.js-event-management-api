import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsOrmEntity } from './infra/payments.orm-entity';
import { PAYMENTS_REPOSITORY } from './domain/payments.repository-interface';
import { PaymentsRepositoryTypeOrm } from './infra/payments.repository-typeorm';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentsOrmEntity])],
  controllers: [PaymentsController],
  providers: [{ provide: PAYMENTS_REPOSITORY, useClass: PaymentsRepositoryTypeOrm }],
  exports: [PAYMENTS_REPOSITORY]
})
export class PaymentsModule {}
