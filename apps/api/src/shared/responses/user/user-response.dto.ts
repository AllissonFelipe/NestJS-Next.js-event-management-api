export interface UserResponseDto {
  id: string;
  fullName: string;
  cpf: string;
  email: string;
  userRole: UserRoleResponseDto;
  userProfile: UserProfileResponseDto;
  createdAt: Date;
  updatedAt: Date;
}

export class UserRoleResponseDto {
  id?: string;
  role: string;
}

export class UserProfileResponseDto {
  id?: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  birthDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
