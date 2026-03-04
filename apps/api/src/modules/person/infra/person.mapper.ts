import { PersonRoleMapper } from 'src/modules/person-role/infra/person-role.mapper';
import { PersonDomainEntity } from '../domain/person.domain-entity';
import { PersonOrmEntity } from './person.orm-entity';
import { PersonProfileMapper } from 'src/modules/person-profile/infra/person-profile.mapper';

export class PersonMapper {
  /**
   * Converte ORM entity em Domain entity
   */
  static toDomain(ormEntity: PersonOrmEntity): PersonDomainEntity {
    if (!ormEntity) {
      throw new Error(`PersonMapper - PersonOrmEntity é requirido`);
    }
    if (!ormEntity.person_role) {
      throw new Error(`PersonRoleOrmEntity é requirido`);
    }
    if (!ormEntity.person_profile) {
      throw new Error(`PersonProfileOrmEntity é requirido`);
    }

    return PersonDomainEntity.restore({
      id: ormEntity.id,
      fullName: ormEntity.full_name,
      cpf: ormEntity.cpf,
      email: ormEntity.email,
      passwordHash: ormEntity.password_hash,
      personRole: PersonRoleMapper.toDomain(ormEntity.person_role),
      personProfile: PersonProfileMapper.toDomain(ormEntity.person_profile),
      isActive: ormEntity.is_active,
      createdAt: ormEntity.created_at,
      updatedAt: ormEntity.updated_at,
    });
  }

  /**
   * Converte Domain entity em ORM entity (para salvar no banco)
   */
  static toOrm(domainEntity: PersonDomainEntity): PersonOrmEntity {
    if (!domainEntity) {
      throw new Error(`PersonDomainEntity é requirido`);
    }
    if (!domainEntity.personRole) {
      throw new Error(`PersonRoleDomainEntity é requirido`);
    }
    if (!domainEntity.personProfile) {
      throw new Error(`PersonProfileDomainEntity é requirido`);
    }

    const orm = new PersonOrmEntity();

    orm.id = domainEntity.id;
    orm.full_name = domainEntity.fullName;
    orm.cpf = domainEntity.cpf;
    orm.email = domainEntity.email;
    orm.password_hash = domainEntity.passwordHash;
    orm.person_role = PersonRoleMapper.toOrm(domainEntity.personRole);
    orm.person_profile = PersonProfileMapper.toOrm(domainEntity.personProfile);
    orm.is_active = domainEntity.isActive;
    orm.created_at = domainEntity.createdAt;
    orm.updated_at = domainEntity.updatedAt;

    return orm;
  }
}
