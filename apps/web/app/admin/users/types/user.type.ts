import { Role } from '@/enums/role.enum';

export type User = {
  person: Person;
  personRole: PersonRole;
  profile: Profile;
};
type Person = {
  id: string;
  fullName: string;
  cpf: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updateddAt: Date;
};
type PersonRole = {
  id: string;
  role: Role;
};
type Profile = {
  id: string;
  avatarUrl: string;
  bio: string;
  phone: string;
  birthDate: Date;
  createdAt: Date;
  updatedAt: Date;
};
