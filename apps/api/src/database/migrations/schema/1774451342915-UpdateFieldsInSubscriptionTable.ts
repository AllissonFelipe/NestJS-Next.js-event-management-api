import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFieldsInSubscriptionTable1774451342915 implements MigrationInterface {
  name = 'UpdateFieldsInSubscriptionTable1774451342915';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_3bd1a4efea4d53be30499e87c35"`);
    await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_6458a5349fd0de39d5ed36129ef"`);
    await queryRunner.query(`ALTER TABLE "subscription" ALTER COLUMN "person_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "subscription" ALTER COLUMN "subscription_plan_id" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "FK_3bd1a4efea4d53be30499e87c35" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "FK_6458a5349fd0de39d5ed36129ef" FOREIGN KEY ("subscription_plan_id") REFERENCES "subscription_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_6458a5349fd0de39d5ed36129ef"`);
    await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_3bd1a4efea4d53be30499e87c35"`);
    await queryRunner.query(`ALTER TABLE "subscription" ALTER COLUMN "subscription_plan_id" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "subscription" ALTER COLUMN "person_id" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "FK_6458a5349fd0de39d5ed36129ef" FOREIGN KEY ("subscription_plan_id") REFERENCES "subscription_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "FK_3bd1a4efea4d53be30499e87c35" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
