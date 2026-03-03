import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewTablePersonProfile1770211148744 implements MigrationInterface {
  name = 'NewTablePersonProfile1770211148744';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "person_profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "avatar_url" character varying, "bio" text, "phone" character varying, "birth_date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1c45412799242595edc87971909" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" ADD "person_profile_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" ADD CONSTRAINT "UQ_528df16241129dedc429b9e805c" UNIQUE ("person_profile_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" ADD CONSTRAINT "FK_528df16241129dedc429b9e805c" FOREIGN KEY ("person_profile_id") REFERENCES "person_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "person" DROP CONSTRAINT "FK_528df16241129dedc429b9e805c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" DROP CONSTRAINT "UQ_528df16241129dedc429b9e805c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" DROP COLUMN "person_profile_id"`,
    );
    await queryRunner.query(`DROP TABLE "person_profile"`);
  }
}
