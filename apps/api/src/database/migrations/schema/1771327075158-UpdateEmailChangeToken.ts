import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEmailChangeToken1771327075158 implements MigrationInterface {
    name = 'UpdateEmailChangeToken1771327075158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_change_token" ADD "new_email" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_change_token" DROP COLUMN "new_email"`);
    }

}
