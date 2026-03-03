import { PersonRoleEnum } from 'src/modules/person-role/domain/person-role.enum';

export interface AdminResponseDto {
  id: string;
  fullName: string;
  cpf: string;
  email: string;
  personRole: AdminRoleResponseDto;
  personProfile: AdminProfileResponseDto;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminRoleResponseDto {
  id: string;
  role: PersonRoleEnum;
}

export interface AdminProfileResponseDto {
  id: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  birthDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
