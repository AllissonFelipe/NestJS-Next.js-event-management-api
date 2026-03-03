/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { PersonProfileOrmEntity } from '../infra/person-profile.orm-entity';
import { PersonProfileDomainEntity } from '../domain/person-profile.domain-entity';

export class PersonProfileMapper {
  /**
   * ORM -> Domain
   */
  static toDomain(
    orm: PersonProfileOrmEntity,
  ): PersonProfileDomainEntity {
    return PersonProfileDomainEntity.restore({
      id: orm.id,
      avatarUrl: orm.avatar_url,
      bio: orm.bio,
      phone: orm.phone,
      birthDate: orm.birth_date,
      createdAt: orm.created_at,
      updatedAt: orm.updated_at,
    });
  }

  /**
   * Domain -> ORM
   */
  static toOrm(
    domain: PersonProfileDomainEntity,
  ): PersonProfileOrmEntity {
    const orm = new PersonProfileOrmEntity();
    
    orm.id = domain.id;
    orm.avatar_url = domain.avatarUrl;
    orm.bio = domain.bio;
    orm.phone = domain.phone;
    orm.birth_date = domain.birthDate;
    orm.created_at = domain.createdAt;
    orm.updated_at = domain.updatedAt;

    return orm;
  }
}
