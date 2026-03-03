import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { UnitOfWorkInterface } from './unit-of-work.interface';

@Injectable()
export class TypeOrmUnitOfWork implements UnitOfWorkInterface {
  constructor(private readonly dataSource: DataSource) {}

  async execute<T>(work: (manager: EntityManager) => Promise<T>): Promise<T> {
    return await this.dataSource.transaction(async (manager) => {
      return await work(manager);
    });
  }
}
