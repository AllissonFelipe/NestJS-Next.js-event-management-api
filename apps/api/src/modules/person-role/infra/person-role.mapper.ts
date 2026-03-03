import { PersonRoleDomainEntity } from '../domain/person-role.domain-entity';
import { PersonRoleOrmEntity } from './person-role.orm-entity';

export class PersonRoleMapper {
  /**
   * Converte ORM entity em Domain entity
   */
  static toDomain(ormEntity: PersonRoleOrmEntity): PersonRoleDomainEntity {
    return PersonRoleDomainEntity.restore({
      id: ormEntity.id,
      role: ormEntity.role,
      createdAt: ormEntity.created_at,
      updatedAt: ormEntity.updated_at,
    });
  }

  /**
   * Converte Domain entity em ORM entity (para salvar no banco)
   */
  static toOrm(domainEntity: PersonRoleDomainEntity): PersonRoleOrmEntity {
    const orm = new PersonRoleOrmEntity();
    orm.id = domainEntity.id;
    orm.role = domainEntity.role;
    orm.created_at = domainEntity.createdAt;
    orm.updated_at = domainEntity.updatedAt;
    return orm;
  }
}
