import { EventReportStatusEnum } from 'src/modules/event-reports/domain/event-report-status.enum';

export interface MyEventReportResponseDto {
  id: string;
  event: MyEventReportEventResponseDto;
  reason: string;
  status: EventReportStatusEnum;
  createdAt: Date;
}
export interface MyEventReportEventResponseDto {
  id: string;
  title: string;
  description: string;
  startAt: Date;
  endAt: Date;
  createdBy: MyEventReportEventCreatedByResponseDto;
}
export interface MyEventReportEventCreatedByResponseDto {
  id: string;
  name: string;
  avatarUrl?: string;
}
