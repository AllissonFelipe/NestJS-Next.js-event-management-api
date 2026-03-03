// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { PersonRoleEnum } from '../../person-role/domain/person-role.enum';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: PersonRoleEnum[]) =>
  SetMetadata(ROLES_KEY, roles);

export const ROLE_HIERARCHY: Record<PersonRoleEnum, number> = {
  [PersonRoleEnum.USER]: 1,
  [PersonRoleEnum.ADMIN]: 2,
};
