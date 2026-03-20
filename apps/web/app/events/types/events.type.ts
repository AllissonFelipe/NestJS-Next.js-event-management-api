export type Events = {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  status: string;
  address: EventAddress;
  createdAt: string;
  updatedAt: string;
  createdBy: CreatedBy;
  goingCount: number;
  interestedCount: number;
};
export type EventAddress = {
  id: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
};
export type CreatedBy = {
  id: string;
  fullName: string;
  avatarUrl: string;
};
