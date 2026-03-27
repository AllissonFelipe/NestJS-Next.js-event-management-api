import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionOrmEntity } from './infra/subscription.orm-entity';
import { SubscriptionController } from './subscription.controller';
import { FindSubscriptionPlansUseCase } from './application/usecase/find-subscription-plans.usecase';
import { SubscriptionPlansModule } from '../subscription-plans/subscription-plans.module';
import { CreateSubscriptionUseCase } from './application/usecase/create-subscription.usecase';
import { PersonModule } from '../person/person.module';
import { SUBSCRIPTION_REPOSITORY } from './domain/subscription.repository-interface';
import { SubscriptionRepositoryTypeOrm } from './infra/subscription.repository-typeorm';
import { PaymentsModule } from '../payments/payments.module';
import { UNIT_OF_WORK } from 'src/database/unit-of-work.interface';
import { TypeOrmUnitOfWork } from 'src/database/typeorm-unit-of-work';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionOrmEntity]), PersonModule, SubscriptionPlansModule, PaymentsModule],
  controllers: [SubscriptionController],
  providers: [
    FindSubscriptionPlansUseCase,
    CreateSubscriptionUseCase,
    {
      provide: SUBSCRIPTION_REPOSITORY,
      useClass: SubscriptionRepositoryTypeOrm
    },
    {
      provide: UNIT_OF_WORK,
      useClass: TypeOrmUnitOfWork
    }
  ],
  exports: [SUBSCRIPTION_REPOSITORY]
})
export class SubscriptionModule {}
