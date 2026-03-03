import { PersonRoleEnum } from 'src/modules/person-role/domain/person-role.enum';

export interface UserResponseDto {
  person: UserPersonResponseDto;
  personRole: UserRoleResponseDto;
  profile: UserProfileResponseDto;
}

export interface UserPersonResponseDto {
  id: string;
  fullName: string;
  cpf: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRoleResponseDto {
  id: string;
  role: PersonRoleEnum;
}

export interface UserProfileResponseDto {
  id: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  birthDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
