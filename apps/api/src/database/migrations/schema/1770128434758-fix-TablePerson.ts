/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class FixTablePerson1770128434758 implements MigrationInterface {
    name = 'FixTablePerson1770128434758'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" DROP CONSTRAINT "FK_d5b554d79fb7beb3a4184238979"`);
        await queryRunner.query(`ALTER TABLE "person" RENAME COLUMN "person_role" TO "person_role_id"`);
        await queryRunner.query(`ALTER TABLE "person" ALTER COLUMN "person_role_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "person" ADD CONSTRAINT "FK_3174485ebeabc40bb5681e1894b" FOREIGN KEY ("person_role_id") REFERENCES "person_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" DROP CONSTRAINT "FK_3174485ebeabc40bb5681e1894b"`);
        await queryRunner.query(`ALTER TABLE "person" ALTER COLUMN "person_role_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "person" RENAME COLUMN "person_role_id" TO "person_role"`);
        await queryRunner.query(`ALTER TABLE "person" ADD CONSTRAINT "FK_d5b554d79fb7beb3a4184238979" FOREIGN KEY ("person_role") REFERENCES "person_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
