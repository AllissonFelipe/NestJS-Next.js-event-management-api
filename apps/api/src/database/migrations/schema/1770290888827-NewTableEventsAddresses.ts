import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewTableEventsAddresses1770290888827 implements MigrationInterface {
  name = 'NewTableEventsAddresses1770290888827';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "events_addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "street" character varying NOT NULL, "number" character varying NOT NULL, "complements" character varying, "neighborhood" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "zip_code" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "event_id" uuid NOT NULL, CONSTRAINT "REL_5a57d683a2f79f23db9c040cc4" UNIQUE ("event_id"), CONSTRAINT "PK_c23530b696af16a7af829edc7fd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_addresses" ADD CONSTRAINT "FK_5a57d683a2f79f23db9c040cc4e" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events_addresses" DROP CONSTRAINT "FK_5a57d683a2f79f23db9c040cc4e"`,
    );
    await queryRunner.query(`DROP TABLE "events_addresses"`);
  }
}
