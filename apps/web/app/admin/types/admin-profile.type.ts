import { Role } from '@/enums/role.enum';

export type AdminProfile = {
  id: string;
  fullName: string;
  cpf: string;
  email: string;
  personRole: PersonRole;
  personProfile: PersonProfile;
  createdAt: Date;
  updatedAt: Date;
};

export type PersonRole = {
  id: string;
  role: Role;
};

export type PersonProfile = {
  id: string;
  avatarUrl: string;
  bio: string;
  birthDate: Date;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
};
