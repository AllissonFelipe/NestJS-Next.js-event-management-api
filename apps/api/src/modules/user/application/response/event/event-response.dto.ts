export interface EventPaginationReponseDto {
  events: EventResponseDto[];
  meta: EventPaginationDetailsDto;
}

export interface EventResponseDto {
  event: EventDetailsDto;
}
export interface EventPaginationDetailsDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface EventDetailsDto {
  id: string;
  title: string;
  description?: string;
  startAt: Date;
  endAt: Date;
  status: string;
  createdBy: EventCreatedByDetailsDto;
  eventAddress: EventAddressDetailsDto;
  createdAt: Date;
  updatedAt: Date;
}
export interface EventAddressDetailsDto {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface EventCreatedByDetailsDto {
  id: string;
  fullName: string;
  avatarUrl?: string;
}
