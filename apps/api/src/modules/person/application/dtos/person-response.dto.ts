export class PersonResponseDto {
  id: string;
  fullName: string;
  cpf: string;
  email: string;
  personRole: PersonRoleResponseDto;
  personProfile: PersonProfileResponseDto;
  createdAt: Date;
  updatedAt: Date;
}

export class PersonRoleResponseDto {
  id: string;
  role: string;
}

export class PersonProfileResponseDto {
  id: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  birthDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
