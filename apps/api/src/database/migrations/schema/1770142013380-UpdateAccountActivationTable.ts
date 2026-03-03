import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAccountActivationTable1770142013380 implements MigrationInterface {
  name = 'UpdateAccountActivationTable1770142013380';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account_activation_token" DROP CONSTRAINT "FK_2e2c5c4ee21ce136b231548d756"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_activation_token" ADD CONSTRAINT "FK_2e2c5c4ee21ce136b231548d756" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account_activation_token" DROP CONSTRAINT "FK_2e2c5c4ee21ce136b231548d756"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_activation_token" ADD CONSTRAINT "FK_2e2c5c4ee21ce136b231548d756" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
