import { EventReportStatusEnum } from 'src/modules/event-reports/domain/event-report-status.enum';

export interface MyEventReportResponseDto {
  id: string;
  event: EventReportResponseDto;
  reason: string;
  status: EventReportStatusEnum;
  createdAt: Date;
}
export interface EventReportResponseDto {
  id: string;
  title: string;
  description: string;
  startAt: Date;
  endAt: Date;
  createdBy: EventCreatedBy;
}
export interface EventCreatedBy {
  id: string;
  name: string;
  avatarUrl: string;
}
