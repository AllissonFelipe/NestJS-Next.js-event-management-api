import { Module } from '@nestjs/common';
import { PersonProfileController } from './person-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonProfileOrmEntity } from './infra/person-profile.orm-entity';
import { PERSON_PROFILE_REPOSITORY } from './domain/person-profile.repository-interface';
import { PersonProfileRepositoryTypeOrm } from './infra/person-profile.repository-typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PersonProfileOrmEntity])],
  controllers: [PersonProfileController],
  providers: [
    {
      provide: PERSON_PROFILE_REPOSITORY,
      useClass: PersonProfileRepositoryTypeOrm,
    },
  ],
  exports: [PERSON_PROFILE_REPOSITORY],
})
export class PersonProfileModule {}
