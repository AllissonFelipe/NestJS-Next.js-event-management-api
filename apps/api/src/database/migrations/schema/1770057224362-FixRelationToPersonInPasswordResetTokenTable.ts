import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRelationToPersonInPasswordResetTokenTable1770057224362 implements MigrationInterface {
    name = 'FixRelationToPersonInPasswordResetTokenTable1770057224362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_reset_token" DROP CONSTRAINT "FK_ea269d7c41b2f037abbb5603d85"`);
        await queryRunner.query(`ALTER TABLE "password_reset_token" DROP CONSTRAINT "REL_ea269d7c41b2f037abbb5603d8"`);
        await queryRunner.query(`ALTER TABLE "password_reset_token" ADD CONSTRAINT "FK_ea269d7c41b2f037abbb5603d85" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_reset_token" DROP CONSTRAINT "FK_ea269d7c41b2f037abbb5603d85"`);
        await queryRunner.query(`ALTER TABLE "password_reset_token" ADD CONSTRAINT "REL_ea269d7c41b2f037abbb5603d8" UNIQUE ("person_id")`);
        await queryRunner.query(`ALTER TABLE "password_reset_token" ADD CONSTRAINT "FK_ea269d7c41b2f037abbb5603d85" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
