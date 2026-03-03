/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class NewTablePasswordResetToken1770035941003 implements MigrationInterface {
    name = 'NewTablePasswordResetToken1770035941003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "password_reset_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "used_at" TIMESTAMP WITH TIME ZONE, "person_id" uuid, CONSTRAINT "REL_ea269d7c41b2f037abbb5603d8" UNIQUE ("person_id"), CONSTRAINT "PK_838af121380dfe3a6330e04f5bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "account_activation_token" DROP COLUMN "used_at"`);
        await queryRunner.query(`ALTER TABLE "account_activation_token" ADD "used_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "password_reset_token" ADD CONSTRAINT "FK_ea269d7c41b2f037abbb5603d85" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_reset_token" DROP CONSTRAINT "FK_ea269d7c41b2f037abbb5603d85"`);
        await queryRunner.query(`ALTER TABLE "account_activation_token" DROP COLUMN "used_at"`);
        await queryRunner.query(`ALTER TABLE "account_activation_token" ADD "used_at" TIMESTAMP`);
        await queryRunner.query(`DROP TABLE "password_reset_token"`);
    }

}
