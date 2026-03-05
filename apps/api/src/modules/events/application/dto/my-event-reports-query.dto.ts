import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { EventReportStatusEnum } from 'src/modules/event-reports/domain/event-report-status.enum';

export class MyEventReportsQueryDto {
  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsEnum(EventReportStatusEnum, { message: 'Status inválido' })
  status?: EventReportStatusEnum;

  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
