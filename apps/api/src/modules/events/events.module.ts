import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsOrmEntity } from './infra/events.orm-entity';
import { EventsImagesOrmEntity } from './events-images/infra/events-images.orm-entity';
import { EventsController } from './events.controller';
import { EventsAddressesOrmEntity } from './events-addresses/infra/events-addresses.orm-entity';
import { PersonModule } from '../person/person.module';
import { UNIT_OF_WORK } from 'src/database/unit-of-work.interface';
import { TypeOrmUnitOfWork } from 'src/database/typeorm-unit-of-work';
import { EVENTS_REPOSITORY } from './domain/events.repository-interface';
import { EventsRepositoryTypeOrm } from './infra/events.repository-typeorm';
import { FindEventsUseCase } from './application/usecase/find-event.usecase';
import { SetEventParticipationStatusUseCase } from './application/usecase/set-event-participation-status.usecase';
import { EnsurePersonExists } from './application/validators/ensure-person-exist.validator';
import { EnsureEventExists } from './application/validators/ensure-event-exist.validator';
import { EventParticipantsModule } from '../event-participants/event-participants.module';
import { DeleteEventParticipationStatusUseCase } from './application/usecase/delete-event-participation-status.usecase';
import { EnsureUserEventParticipationExist } from './application/validators/ensure-user-event-participation-exist.validator';
import { ReportEventUseCase } from './application/usecase/report-event.usecase';
import { EnsureEventAlreadyNotReportedByUser } from './application/validators/ensure-event-not-reported-by-user.validator';
import { EventAddressesModule } from './events-addresses/event-addresses.module';
import { EventReportModule } from '../event-reports/event-report.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventsOrmEntity,
      EventsImagesOrmEntity,
      EventsAddressesOrmEntity,
    ]),
    PersonModule,
    EventAddressesModule,
    EventParticipantsModule,
    EventReportModule,
  ],
  controllers: [EventsController],
  providers: [
    FindEventsUseCase,
    SetEventParticipationStatusUseCase,
    EnsurePersonExists,
    EnsureEventExists,
    DeleteEventParticipationStatusUseCase,
    EnsureUserEventParticipationExist,
    ReportEventUseCase,
    EnsureEventAlreadyNotReportedByUser,
    {
      provide: EVENTS_REPOSITORY,
      useClass: EventsRepositoryTypeOrm,
    },
    {
      provide: UNIT_OF_WORK,
      useClass: TypeOrmUnitOfWork,
    },
  ],
  exports: [EVENTS_REPOSITORY],
})
export class EventsModule {}
