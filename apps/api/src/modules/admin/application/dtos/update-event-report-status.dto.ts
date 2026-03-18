import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { EventReportStatusEnum } from 'src/modules/event-reports/domain/event-report-status.enum';

export class UpdateEventReportStatusDto {
  @IsOptional()
  @IsEnum(EventReportStatusEnum)
  @IsNotEmpty()
  status?: EventReportStatusEnum;
}
