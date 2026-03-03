import { Module } from '@nestjs/common';
import { PersonModule } from '../person/person.module';
import { PersonRoleModule } from '../person-role/person-role.module';
import { PersonProfileModule } from '../person-profile/person-profile.module';
import { UserController } from './user.controller';
import { FindUserProfileUseCase } from './application/usecase/find-user-profile.usecase';
import { EnsureUserExists } from './application/validator/ensure-user-exists.validator';
import { UpdateUserProfileUsecase } from './application/usecase/update-user-profile.usecase';
import { UNIT_OF_WORK } from 'src/database/unit-of-work.interface';
import { TypeOrmUnitOfWork } from 'src/database/typeorm-unit-of-work';
import { EmailChangeTokenModule } from '../email-change-token/email-change-token.module';
import { ChangeUserEmailUseCase } from './application/usecase/change-user-email.usecase';
import { EnsureEmailIsAvailable } from './application/validator/ensure-email-is-available.validator';
import { MAIL_SERVICE } from '../mail/domain/mail-service.interface';
import { MailHogEmailService } from '../mail/infra/mailhog-email.service';
import { UserCreateEventUseCase } from './application/usecase/create-event.usecase';
import { EventsModule } from '../events/events.module';
import { UserFindEventsUseCase } from './application/usecase/find-events.usecase';
import { UserUpdateEventUseCase } from './application/usecase/update-event.usecase';
import { UserDeleteEventUseCase } from './application/usecase/delete-event.usecase';

@Module({
  imports: [
    PersonModule,
    PersonRoleModule,
    PersonProfileModule,
    EmailChangeTokenModule,
    EventsModule,
  ],
  controllers: [UserController],
  providers: [
    FindUserProfileUseCase,
    UpdateUserProfileUsecase,
    ChangeUserEmailUseCase,
    EnsureUserExists,
    EnsureEmailIsAvailable,
    UserCreateEventUseCase,
    UserFindEventsUseCase,
    UserUpdateEventUseCase,
    UserDeleteEventUseCase,
    {
      provide: UNIT_OF_WORK,
      useClass: TypeOrmUnitOfWork,
    },
    {
      provide: MAIL_SERVICE,
      useClass: MailHogEmailService,
    },
  ],
  exports: [],
})
export class UserModule {}
