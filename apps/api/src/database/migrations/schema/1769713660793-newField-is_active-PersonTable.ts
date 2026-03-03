/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class NewFieldIsActivePersonTable1769713660793 implements MigrationInterface {
    name = 'NewFieldIsActivePersonTable1769713660793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" ADD "is_active" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "is_active"`);
    }

}
