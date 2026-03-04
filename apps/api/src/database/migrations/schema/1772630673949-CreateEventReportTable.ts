import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventReportTable1772630673949 implements MigrationInterface {
  name = 'CreateEventReportTable1772630673949';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."event_report_status_enum" AS ENUM('OPEN', 'REVIEWED', 'RESOLVED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_reports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reason" text NOT NULL, "status" "public"."event_report_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "event_id" uuid NOT NULL, "reporter_id" uuid NOT NULL, CONSTRAINT "UQ_c0a1e6cd9c7c2d2f423e24ffdd1" UNIQUE ("event_id", "reporter_id"), CONSTRAINT "PK_14032c2fbbc04b1e79ba38dabe3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_reports" ADD CONSTRAINT "FK_48c46235d0db6bdba80fda2e947" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_reports" ADD CONSTRAINT "FK_8b3ac0971b2cc1b54fcc7c31cb1" FOREIGN KEY ("reporter_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_reports" DROP CONSTRAINT "FK_8b3ac0971b2cc1b54fcc7c31cb1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_reports" DROP CONSTRAINT "FK_48c46235d0db6bdba80fda2e947"`,
    );
    await queryRunner.query(`DROP TABLE "event_reports"`);
    await queryRunner.query(`DROP TYPE "public"."event_report_status_enum"`);
  }
}
