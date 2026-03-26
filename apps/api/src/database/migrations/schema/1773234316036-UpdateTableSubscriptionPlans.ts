import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTableSubscriptionPlans1773234316036 implements MigrationInterface {
  name = 'UpdateTableSubscriptionPlans1773234316036';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subscription_plans" ADD "created_by" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "subscription_plans" ADD CONSTRAINT "FK_d27e0aceeab0c26b7b07256af4e" FOREIGN KEY ("created_by") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subscription_plans" DROP CONSTRAINT "FK_d27e0aceeab0c26b7b07256af4e"`,
    );
    await queryRunner.query(`ALTER TABLE "subscription_plans" DROP COLUMN "created_by"`);
  }
}
