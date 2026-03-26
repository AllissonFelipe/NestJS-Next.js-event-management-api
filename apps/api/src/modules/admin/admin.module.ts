import { Module } from '@nestjs/common';
import { PersonModule } from '../person/person.module';
import { PersonRoleModule } from '../person-role/person-role.module';
import { PersonProfileModule } from '../person-profile/person-profile.module';
import { AdminController } from './admin.controller';
import { FindAdminProfileUseCase } from './application/usecase/find-admin-profile.usecase';
import { IsAdminValidator } from './application/validators/is-admin.validator';
import { AdminFindUsersUseCase } from './application/usecase/user/admin-find-users.usecase';
import { AdminFindEventsUseCase } from './application/usecase/events/find-events.usecase';
import { EventsModule } from '../events/events.module';
import { AdminDeleteEventUseCase } from './application/usecase/events/delete-event.usecase';
import { AdminUpdateUserUseCase } from './application/usecase/user/update-user.usecase';
import { UNIT_OF_WORK } from 'src/database/unit-of-work.interface';
import { TypeOrmUnitOfWork } from 'src/database/typeorm-unit-of-work';
import { AdminDeleteUserUseCase } from './application/usecase/user/delete-user.usecase';
import { AdminFindEventReportUseCase } from './application/usecase/event-reports/find-event-report.usecase';
import { AdminEnsureEventExistsValidator } from './application/validators/ensure-event-exist.validator';
import { EventReportModule } from '../event-reports/event-report.module';
import { AdminUpdateEventReportStatusUseCase } from './application/usecase/event-reports/update-event-report-status.usecase';
import { AdminEnsureEventReportExistsValidator } from './application/validators/ensure-event-report-exist.validator';
import { AdminApproveEventUseCase } from './application/usecase/events/approve-event.usecase';
import { AdminRejectEventUseCase } from './application/usecase/events/reject-event.usecase';
import { EventApprovedListener } from './application/listeners/event-approved.listener';
import { MailModule } from '../mail/mail.module';
import { EventRejectedListener } from './application/listeners/event-rejected.listener';
import { AdminCreateSubscriptionPlanUseCase } from './application/usecase/subscription-plans/create-subscription-plan.usecase';
import { SubscriptionPlansModule } from '../subscription-plans/subscription-plans.module';
import { AdminFindSubscriptionPlanUseCase } from './application/usecase/subscription-plans/find-subscription-plan.usecase';
import { AdminUpdateSubscriptionPlanUseCase } from './application/usecase/subscription-plans/update-subscription-plan.usecase';
import { AdminUpdateStatusSubscriptionPlanUseCase } from './application/usecase/subscription-plans/update-status-subscription-plan.usecase';
import { AdminDeleteSubscriptionPlanUseCase } from './application/usecase/subscription-plans/delete-subscription-plan.usecase';
import { AdminUsersController } from './controllers/admin-users.controller';
import { AdminEventsController } from './controllers/admin-events.controller';
import { AdminUserEventsController } from './controllers/admin-user-events.controller';
import { AdminEventsReportsController } from './controllers/admin-events-reports.controller';
import { AdminSubscriptionPlansController } from './controllers/admin-subscription-plans.controller';

@Module({
  imports: [
    PersonModule,
    PersonRoleModule,
    PersonProfileModule,
    EventsModule,
    EventReportModule,
    MailModule,
    SubscriptionPlansModule
  ],
  controllers: [
    AdminController,
    AdminUsersController,
    AdminEventsController,
    AdminUserEventsController,
    AdminEventsReportsController,
    AdminSubscriptionPlansController
  ],
  providers: [
    FindAdminProfileUseCase,
    AdminFindUsersUseCase,
    AdminFindEventsUseCase,
    AdminApproveEventUseCase,
    AdminRejectEventUseCase,
    AdminDeleteEventUseCase,
    AdminUpdateUserUseCase,
    AdminUpdateUserUseCase,
    AdminDeleteUserUseCase,
    AdminFindEventReportUseCase,
    AdminUpdateEventReportStatusUseCase,
    AdminEnsureEventExistsValidator,
    AdminEnsureEventReportExistsValidator,
    IsAdminValidator,
    EventApprovedListener,
    EventRejectedListener,
    AdminCreateSubscriptionPlanUseCase,
    AdminFindSubscriptionPlanUseCase,
    AdminUpdateSubscriptionPlanUseCase,
    AdminUpdateStatusSubscriptionPlanUseCase,
    AdminDeleteSubscriptionPlanUseCase,
    {
      provide: UNIT_OF_WORK,
      useClass: TypeOrmUnitOfWork
    }
  ],
  exports: []
})
export class AdminModule {}
