import { PersonRoleEnum } from 'src/modules/person-role/domain/person-role.enum';

export interface AdminSubscriptionPlanResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  durationInDays: number;
  isActive: boolean;
  createdBy: AdminPersonResponseDto;
  createdAt: Date;
  updatedAt: Date;
}
export interface AdminPersonResponseDto {
  id: string;
  fullName: string;
  email: string;
  personRole: AdminPersonRoleResponseDto;
  personProfile: AdminPersonProfileResponseDto;
}
export interface AdminPersonRoleResponseDto {
  id: string;
  role: PersonRoleEnum;
}
export interface AdminPersonProfileResponseDto {
  id: string;
  avatarUrl?: string;
  phone?: string;
}
