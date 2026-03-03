export interface PersonRepositoryFiltersInterface {
  fullName?: string;
  cpf?: string;
  email?: string;
  isActive?: boolean;
  createdAt?: string;

  page: number;
  limit: number;
}
