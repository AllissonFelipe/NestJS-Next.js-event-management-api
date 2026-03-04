import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventReportOrmEntity } from './infra/event-report.orm-entity';
import { EventReportRepositoryTypeOrm } from './infra/event-report.repository-typeorm';
import { EVENT_REPORT_REPOSITORY } from './domain/event-report.repository-interface';

@Module({
  imports: [TypeOrmModule.forFeature([EventReportOrmEntity])],
  controllers: [],
  providers: [
    {
      provide: EVENT_REPORT_REPOSITORY,
      useClass: EventReportRepositoryTypeOrm,
    },
  ],
  exports: [EVENT_REPORT_REPOSITORY],
})
export class EventReportModule {}
