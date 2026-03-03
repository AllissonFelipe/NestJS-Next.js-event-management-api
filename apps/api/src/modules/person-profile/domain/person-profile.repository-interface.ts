import { EntityManager } from 'typeorm';
import { PersonProfileDomainEntity } from './person-profile.domain-entity';

export const PERSON_PROFILE_REPOSITORY = Symbol('PERSON_PROFILE_REPOSITORY');

export interface PersonProfileRepositoryInterface {
  saveProfile(
    profile: PersonProfileDomainEntity,
    manager?: EntityManager,
  ): Promise<PersonProfileDomainEntity>;
}
