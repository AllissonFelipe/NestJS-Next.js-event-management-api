import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventsTable1772106623993 implements MigrationInterface {
    name = 'UpdateEventsTable1772106623993'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events_addresses" RENAME COLUMN "complements" TO "complement"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5a57d683a2f79f23db9c040cc4" ON "events_addresses" ("event_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_5a57d683a2f79f23db9c040cc4"`);
        await queryRunner.query(`ALTER TABLE "events_addresses" RENAME COLUMN "complement" TO "complements"`);
    }

}
