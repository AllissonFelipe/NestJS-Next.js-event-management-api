import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePersonTable1769430905113 implements MigrationInterface {
    name = 'UpdatePersonTable1769430905113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" RENAME COLUMN "fullName" TO "full_name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" RENAME COLUMN "full_name" TO "fullName"`);
    }

}
