import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlansOrmEntity } from './infra/subscription-plans.orm-entity';
import { SUBSCRIPTION_PLANS_REPOSITORY } from './domain/subscription-plans.repository-interface';
import { SubscriptionPlansRepositoryTypeOrm } from './infra/subscription-plans.repository-typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionPlansOrmEntity])],
  controllers: [],
  providers: [
    {
      provide: SUBSCRIPTION_PLANS_REPOSITORY,
      useClass: SubscriptionPlansRepositoryTypeOrm
    }
  ],
  exports: [SUBSCRIPTION_PLANS_REPOSITORY]
})
export class SubscriptionPlansModule {}
