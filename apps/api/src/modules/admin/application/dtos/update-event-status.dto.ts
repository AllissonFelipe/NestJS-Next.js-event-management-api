import { IsEnum, IsOptional } from 'class-validator';
import { EventsStatusEnum } from 'src/modules/events/domain/events-status.enum';

export class UpdateEventStatusDto {
  @IsOptional()
  @IsEnum(EventsStatusEnum)
  eventStatus?: EventsStatusEnum;
}
