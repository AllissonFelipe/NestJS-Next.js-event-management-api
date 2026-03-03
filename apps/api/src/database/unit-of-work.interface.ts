/* eslint-disable prettier/prettier */
import { EntityManager } from "typeorm";

export const UNIT_OF_WORK = 'UNIT_OF_WORK';
export interface UnitOfWorkInterface {
  execute<T>(work: (manager: EntityManager) => Promise<T>): Promise<T>;
}
