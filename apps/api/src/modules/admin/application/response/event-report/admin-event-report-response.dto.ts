import { EventReportStatusEnum } from 'src/modules/event-reports/domain/event-report-status.enum';

export interface AdminEventsReportsWithQueryResponseDto {
  items: AdminEventReportResponseDto[];
  meta: {
    page?: number;
    limit?: number;
    total: number;
    totalPages?: number;
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
  };
}
export interface AdminEventReportResponseDto {
  id: string;
  event: AdminEventReportEventResponseDto;
  reason: string;
  status: EventReportStatusEnum;
  createdAt: Date;
}
export interface AdminEventReportEventResponseDto {
  id: string;
  title: string;
  description: string;
  startAt: Date;
  endAt: Date;
  createdBy: AdminEventReportEventCreatedByResponseDto;
}
export interface AdminEventReportEventCreatedByResponseDto {
  id: string;
  name: string;
  avatarUrl?: string;
}
