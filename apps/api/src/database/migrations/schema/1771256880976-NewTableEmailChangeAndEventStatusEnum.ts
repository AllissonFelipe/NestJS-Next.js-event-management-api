import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewTableEmailChangeAndEventStatusEnum1771256880976 implements MigrationInterface {
  name = 'NewTableEmailChangeAndEventStatusEnum1771256880976';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "email_change_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "used_at" TIMESTAMP WITH TIME ZONE, "person_id" uuid, CONSTRAINT "PK_211d345a36ed925175f54ac949a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."events_status_enum" RENAME TO "events_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."events_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'UPCOMING', 'IN_PROGRESS', 'CONCLUDED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ALTER COLUMN "status" TYPE "public"."events_status_enum" USING "status"::"text"::"public"."events_status_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."events_status_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "email_change_token" ADD CONSTRAINT "FK_6945cf54b7d26dc0ee7327f89e8" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email_change_token" DROP CONSTRAINT "FK_6945cf54b7d26dc0ee7327f89e8"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."events_status_enum_old" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ALTER COLUMN "status" TYPE "public"."events_status_enum_old" USING "status"::"text"::"public"."events_status_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."events_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."events_status_enum_old" RENAME TO "events_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "email_change_token"`);
  }
}
