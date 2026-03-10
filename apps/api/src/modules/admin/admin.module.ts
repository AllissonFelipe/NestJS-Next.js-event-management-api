import { Module } from '@nestjs/common';
import { PersonModule } from '../person/person.module';
import { PersonRoleModule } from '../person-role/person-role.module';
import { PersonProfileModule } from '../person-profile/person-profile.module';
import { AdminController } from './admin.controller';
import { FindAdminProfileUseCase } from './application/usecase/find-admin-profile.usecase';
import { IsAdminValidator } from './application/validators/is-admin.validator';
import { FindUsersUseCase } from './application/usecase/user/find-users.usecase';
import { FindEventsUseCase } from './application/usecase/events/find-events.usecase';
import { EventsModule } from '../events/events.module';
import { UpdateEventStatusUseCase } from './application/usecase/events/update-event-status.usecase';
import { DeleteEventUseCase } from './application/usecase/events/delete-event.usecase';
import { AdminUpdateUserUseCase } from './application/usecase/user/update-user.usecase';
import { UNIT_OF_WORK } from 'src/database/unit-of-work.interface';
import { TypeOrmUnitOfWork } from 'src/database/typeorm-unit-of-work';
import { AdminDeleteUserUseCase } from './application/usecase/user/delete-user.usecase';
import { AdminFindEventReportUseCase } from './application/usecase/event-reports/find-event-report.usecase';
import { AdminEnsureEventExistsValidator } from './application/validators/ensure-event-exist.validator';
import { EventReportModule } from '../event-reports/event-report.module';
import { AdminPatchEventReportStatusUseCase } from './application/usecase/event-reports/patch-event-report-status.usecase';
import { AdminEnsureEventReportExistsValidator } from './application/validators/ensure-event-report-exist.validator';
import { AdminApproveEventUseCase } from './application/usecase/events/approve-event.usecase';
import { AdminRejectEventUseCase } from './application/usecase/events/reject-event.usecase';
import { EventApprovedListener } from './application/listeners/event-approved.listener';
import { MailModule } from '../mail/mail.module';
import { EventRejectedListener } from './application/listeners/event-rejected.listener';

@Module({
  imports: [
    PersonModule,
    PersonRoleModule,
    PersonProfileModule,
    EventsModule,
    EventReportModule,
    MailModule,
  ],
  controllers: [AdminController],
  providers: [
    FindAdminProfileUseCase,
    FindUsersUseCase,
    FindEventsUseCase,
    UpdateEventStatusUseCase,
    AdminApproveEventUseCase,
    AdminRejectEventUseCase,
    DeleteEventUseCase,
    AdminUpdateUserUseCase,
    AdminUpdateUserUseCase,
    AdminDeleteUserUseCase,
    AdminFindEventReportUseCase,
    AdminPatchEventReportStatusUseCase,
    AdminEnsureEventExistsValidator,
    AdminEnsureEventReportExistsValidator,
    IsAdminValidator,
    EventApprovedListener,
    EventRejectedListener,
    {
      provide: UNIT_OF_WORK,
      useClass: TypeOrmUnitOfWork,
    },
  ],
  exports: [],
})
export class AdminModule {}
