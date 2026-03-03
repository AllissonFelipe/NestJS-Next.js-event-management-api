import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewTableEventsImages1770232939961 implements MigrationInterface {
  name = 'NewTableEventsImages1770232939961';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_03dcebc1ab44daa177ae9479c4"`,
    );
    await queryRunner.query(
      `CREATE TABLE "events_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "image_url" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "event_id" uuid NOT NULL, CONSTRAINT "PK_825d75fb148ecaf99e305ab945b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EVENTS_IMAGES_EVENT_ID" ON "events_images" ("event_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EVENTS_STATUS" ON "events" ("status") `,
    );
    await queryRunner.query(
      `ALTER TABLE "events_images" ADD CONSTRAINT "FK_fbe0e902db77f8f6490f365d867" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events_images" DROP CONSTRAINT "FK_fbe0e902db77f8f6490f365d867"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_EVENTS_STATUS"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EVENTS_IMAGES_EVENT_ID"`);
    await queryRunner.query(`DROP TABLE "events_images"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_03dcebc1ab44daa177ae9479c4" ON "events" ("status") `,
    );
  }
}
