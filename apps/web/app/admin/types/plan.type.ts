import { Role } from '@/enums/role.enum';

export type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationInDays: number;
  isActive: boolean;
  createdBy: CreatedBy;
  createdAt: Date;
  updatedAt: Date;
};
type CreatedBy = {
  id: string;
  fullName: string;
  email: string;
  personRole: PersonRole;
  personProfile: PersonProfile;
};
type PersonRole = {
  id: string;
  role: Role;
};
type PersonProfile = {
  id: string;
  avatarUrl: string;
  phone: string;
};
