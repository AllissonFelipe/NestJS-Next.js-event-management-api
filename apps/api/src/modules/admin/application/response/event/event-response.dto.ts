import { EventsStatusEnum } from 'src/modules/events/domain/events-status.enum';

export class EventResponseWithPaginationDto {
  items: EventResponseDto[];
  meta: EventPaginationDto;
}
export class EventResponseDto {
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
}
export class EventPaginationDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
export class EventAddressResponseDto {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}
