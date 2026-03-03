import { IsEnum } from 'class-validator';
import { EventParticipantStatusEnum } from 'src/modules/event-participants/domain/event-participants.status-enum';

export class SetParticipationStatusDto {
  @IsEnum(EventParticipantStatusEnum)
  status: EventParticipantStatusEnum;
}
