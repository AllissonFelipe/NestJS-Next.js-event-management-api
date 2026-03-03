/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { EventsAddressDomainEntity } from '../domain/events-addresses.domain-entity';
import { EventsAddressesOrmEntity } from '../infra/events-addresses.orm-entity';


export class EventsAddressMapper {
  static toDomain(
    ormEntity: EventsAddressesOrmEntity,
  ): EventsAddressDomainEntity {

    if (!ormEntity) {
      throw new Error(`não pode ser null`)
    }

    return EventsAddressDomainEntity.restore({
      id: ormEntity.id,
      street: ormEntity.street,
      number: ormEntity.number,
      complement: ormEntity.complement,
      neighborhood: ormEntity.neighborhood,
      city: ormEntity.city,
      state: ormEntity.state,
      zipCode: ormEntity.zip_code,
      createdAt: ormEntity.created_at,
      updatedAt: ormEntity.updated_at,
    });
  }

  static toOrm(
    domainEntity: EventsAddressDomainEntity,
  ): EventsAddressesOrmEntity {
    const ormEntity = new EventsAddressesOrmEntity();

    ormEntity.id = domainEntity.id;
    ormEntity.street = domainEntity.street;
    ormEntity.number = domainEntity.number;
    ormEntity.complement = domainEntity.complement;
    ormEntity.neighborhood = domainEntity.neighborhood;
    ormEntity.city = domainEntity.city;
    ormEntity.state = domainEntity.state;
    ormEntity.zip_code = domainEntity.zipCode;
    ormEntity.created_at = domainEntity.createdAt;
    ormEntity.updated_at = domainEntity.updatedAt;

    return ormEntity;
  }
}
