import { Module } from '@nestjs/common';
import { EventParticipantsController } from './event-participants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EVENT_PARTICIPANTS_REPOSITORY } from './domain/event-participants.repository-interface';
import { EventParticipantsOrmEntity } from './infra/event-participants.orm-entity';
import { EventParticipantsRepositoryTypeOrm } from './infra/event-participants.repository-typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EventParticipantsOrmEntity])],
  controllers: [EventParticipantsController],
  providers: [
    {
      provide: EVENT_PARTICIPANTS_REPOSITORY,
      useClass: EventParticipantsRepositoryTypeOrm,
    },
  ],
  exports: [EVENT_PARTICIPANTS_REPOSITORY],
})
export class EventParticipantsModule {}
