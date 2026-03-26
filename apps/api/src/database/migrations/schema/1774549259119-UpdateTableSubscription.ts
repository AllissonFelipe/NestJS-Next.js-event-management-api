import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableSubscription1774549259119 implements MigrationInterface {
    name = 'UpdateTableSubscription1774549259119'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" ALTER COLUMN "start_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscription" ALTER COLUMN "end_at" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" ALTER COLUMN "end_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscription" ALTER COLUMN "start_at" SET NOT NULL`);
    }

}
