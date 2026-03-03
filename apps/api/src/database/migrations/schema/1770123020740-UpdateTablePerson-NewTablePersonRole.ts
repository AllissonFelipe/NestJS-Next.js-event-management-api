import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTablePersonNewTablePersonRole1770123020740 implements MigrationInterface {
  name = 'UpdateTablePersonNewTablePersonRole1770123020740';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."person_role_role_enum" AS ENUM('ADMIN', 'USER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "person_role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."person_role_role_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b63166e260f6ff5c706dd57f285" UNIQUE ("role"), CONSTRAINT "PK_7dfed12a35115c66c0ab0c22b0d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "person" ADD "person_role" uuid`);
    await queryRunner.query(
      `ALTER TABLE "person" ADD CONSTRAINT "FK_d5b554d79fb7beb3a4184238979" FOREIGN KEY ("person_role") REFERENCES "person_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "person" DROP CONSTRAINT "FK_d5b554d79fb7beb3a4184238979"`,
    );
    await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "person_role"`);
    await queryRunner.query(`DROP TABLE "person_role"`);
    await queryRunner.query(`DROP TYPE "public"."person_role_role_enum"`);
  }
}
