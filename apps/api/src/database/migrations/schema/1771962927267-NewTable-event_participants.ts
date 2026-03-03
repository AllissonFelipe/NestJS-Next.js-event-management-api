import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewTableEventParticipants1771962927267 implements MigrationInterface {
  name = 'NewTableEventParticipants1771962927267';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."event_participants_status_enum" AS ENUM('GOING', 'NOT_GOING', 'INTERESTED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_participants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."event_participants_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "event_id" uuid, "person_id" uuid, CONSTRAINT "UQ_08aab5dd87ff61ce05d283eb23c" UNIQUE ("event_id", "person_id"), CONSTRAINT "PK_b65ffd558d76fd51baffe81d42b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_participants" ADD CONSTRAINT "FK_b5349807aae71193d0cc0f52e35" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_participants" ADD CONSTRAINT "FK_c017c8d595115459d755628627a" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_participants" DROP CONSTRAINT "FK_c017c8d595115459d755628627a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_participants" DROP CONSTRAINT "FK_b5349807aae71193d0cc0f52e35"`,
    );
    await queryRunner.query(`DROP TABLE "event_participants"`);
    await queryRunner.query(
      `DROP TYPE "public"."event_participants_status_enum"`,
    );
  }
}
