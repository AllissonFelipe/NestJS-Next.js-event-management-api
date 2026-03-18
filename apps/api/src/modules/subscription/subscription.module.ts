import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionOrmEntity } from './infra/subscription.orm-entity';
import { SubscriptionController } from './subscription.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionOrmEntity])],
  controllers: [SubscriptionController],
  providers: [],
  exports: [],
})
export class SubscriptionModule {}
