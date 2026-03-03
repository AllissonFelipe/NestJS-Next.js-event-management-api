import { EventsStatusEnum } from 'src/modules/events/domain/events-status.enum';

export interface EventWithPaginationResponseDto {
  items: EventResponseDto[];
  meta: EventPaginationDto;
}
export interface EventResponseDto {
  id: string;
  title: string;
  description?: string;
  startAt: Date;
  endAt: Date;
  status: EventsStatusEnum;
  address: EventAddressResponseDto;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
  goingCount?: number;
  interestedCount?: number;
}
export interface EventWithParticipantsResponseDto {
  id: string;
  title: string;
  description?: string;
  startAt: Date;
  endAt: Date;
  status: EventsStatusEnum;
  address: EventAddressResponseDto;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
  going: {
    count: number;
    participants: EventParticipantsResponseDto[];
  };
  interested: {
    count: number;
    participants: EventParticipantsResponseDto[];
  };
}
export interface EventPaginationDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
export interface EventAddressResponseDto {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}
export interface EventParticipantsResponseDto {
  id: string;
  fullName: string;
  avatarUrl: string;
}
