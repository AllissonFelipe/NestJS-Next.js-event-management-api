import { Module } from '@nestjs/common';
import { PersonRoleController } from './person-role.controller';
import { PERSON_ROLE_REPOSITORY } from './domain/person-role.repository-interface';
import { PersonRoleRepositoryTypeOrm } from './infra/person-role.repository-typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonRoleOrmEntity } from './infra/person-role.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([PersonRoleOrmEntity])],
  controllers: [PersonRoleController],
  providers: [
    {
      provide: PERSON_ROLE_REPOSITORY,
      useClass: PersonRoleRepositoryTypeOrm,
    },
  ],
  exports: [PERSON_ROLE_REPOSITORY],
})
export class PersonRoleModule {}
