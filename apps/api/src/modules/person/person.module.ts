import { Module } from '@nestjs/common';
import { PersonController } from './person.controller';
import { PERSON_REPOSITORY } from './domain/person.repository-interface';
import { PersonRepositoryTypeOrm } from './infra/person.repository-typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonOrmEntity } from './infra/person.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([PersonOrmEntity])],
  controllers: [PersonController],
  providers: [
    {
      provide: PERSON_REPOSITORY,
      useClass: PersonRepositoryTypeOrm,
    },
  ],
  exports: [PERSON_REPOSITORY],
})
export class PersonModule {}
