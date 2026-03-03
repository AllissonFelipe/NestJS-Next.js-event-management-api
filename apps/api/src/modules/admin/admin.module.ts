import { Module } from '@nestjs/common';
import { PersonModule } from '../person/person.module';
import { PersonRoleModule } from '../person-role/person-role.module';
import { PersonProfileModule } from '../person-profile/person-profile.module';
import { AdminController } from './admin.controller';
import { FindAdminProfileUseCase } from './application/usecase/find-admin-profile.usecase';
import { IsAdminValidator } from './application/validators/is-admin.validator';
import { FindUsersUseCase } from './application/usecase/find-users.usecase';
import { FindEventsUseCase } from './application/usecase/find-events.usecase';
import { EventsModule } from '../events/events.module';
import { UpdateEventStatusUseCase } from './application/usecase/update-event-status.usecase';
import { DeleteEventUseCase } from './application/usecase/delete-event.usecase';
import { AdminUpdateUserUseCase } from './application/usecase/update-user.usecase';
import { UNIT_OF_WORK } from 'src/database/unit-of-work.interface';
import { TypeOrmUnitOfWork } from 'src/database/typeorm-unit-of-work';
import { AdminDeleteUserUseCase } from './application/usecase/delete-user.usecase';

@Module({
  imports: [PersonModule, PersonRoleModule, PersonProfileModule, EventsModule],
  controllers: [AdminController],
  providers: [
    FindAdminProfileUseCase,
    IsAdminValidator,
    FindUsersUseCase,
    FindEventsUseCase,
    UpdateEventStatusUseCase,
    DeleteEventUseCase,
    AdminUpdateUserUseCase,
    AdminUpdateUserUseCase,
    AdminDeleteUserUseCase,
    {
      provide: UNIT_OF_WORK,
      useClass: TypeOrmUnitOfWork,
    },
  ],
  exports: [],
})
export class AdminModule {}
