import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionOrmEntity } from './infra/subscription.orm-entity';
import { SubscriptionController } from './subscription.controller';
import { FindSubscriptionPlansUseCase } from './application/usecase/find-subscription-plans.usecase';
import { SubscriptionPlansModule } from '../subscription-plans/subscription-plans.module';
import { CreateSubscriptionUseCase } from './application/usecase/create-subscription.usecase';
import { PersonModule } from '../person/person.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionOrmEntity]), PersonModule, SubscriptionPlansModule],
  controllers: [SubscriptionController],
  providers: [FindSubscriptionPlansUseCase, CreateSubscriptionUseCase],
  exports: []
})
export class SubscriptionModule {}
