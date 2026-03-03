import { EventParticipantStatusEnum } from 'src/modules/event-participants/domain/event-participants.status-enum';

export interface EventParticipantsResponseDto {
  event: {
    id: string;
    title: string;
  };
  person: {
    id: string;
    fullName: string;
  };
  status: EventParticipantStatusEnum;
}
