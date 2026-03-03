import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewTableEvents1770230108866 implements MigrationInterface {
  name = 'NewTableEvents1770230108866';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."events_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text, "start_at" TIMESTAMP NOT NULL, "end_at" TIMESTAMP NOT NULL, "status" "public"."events_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_03dcebc1ab44daa177ae9479c4" ON "events" ("status") `,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_1a259861a2ce114f074b366eed2" FOREIGN KEY ("created_by") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_1a259861a2ce114f074b366eed2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_03dcebc1ab44daa177ae9479c4"`,
    );
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(`DROP TYPE "public"."events_status_enum"`);
  }
}
