import { PersonRoleEnum } from 'src/modules/person-role/domain/person-role.enum';

export interface JwtPayLoad {
  sub: string;
  role: PersonRoleEnum;
}
