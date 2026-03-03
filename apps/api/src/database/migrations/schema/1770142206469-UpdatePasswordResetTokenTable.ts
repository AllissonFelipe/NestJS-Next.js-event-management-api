import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePasswordResetTokenTable1770142206469 implements MigrationInterface {
  name = 'UpdatePasswordResetTokenTable1770142206469';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "password_reset_token" DROP CONSTRAINT "FK_ea269d7c41b2f037abbb5603d85"`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_reset_token" ADD CONSTRAINT "FK_ea269d7c41b2f037abbb5603d85" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "password_reset_token" DROP CONSTRAINT "FK_ea269d7c41b2f037abbb5603d85"`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_reset_token" ADD CONSTRAINT "FK_ea269d7c41b2f037abbb5603d85" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
