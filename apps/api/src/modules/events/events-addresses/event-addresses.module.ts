import { Module } from '@nestjs/common';
import { EventsAddressesRepositoryTypeOrm } from './infra/events-addresses.repository-typeorm';
import { EVENTS_ADDRESSES_REPOSITORY } from './domain/events-addresses.repository-interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsAddressesOrmEntity } from './infra/events-addresses.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventsAddressesOrmEntity])],
  controllers: [],
  providers: [
    {
      provide: EVENTS_ADDRESSES_REPOSITORY,
      useClass: EventsAddressesRepositoryTypeOrm,
    },
  ],
  exports: [EVENTS_ADDRESSES_REPOSITORY],
})
export class EventAddressesModule {}
