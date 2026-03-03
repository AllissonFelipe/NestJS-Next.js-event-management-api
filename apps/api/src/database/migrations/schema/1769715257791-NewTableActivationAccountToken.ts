import { MigrationInterface, QueryRunner } from "typeorm";

export class NewTableActivationAccountToken1769715257791 implements MigrationInterface {
    name = 'NewTableActivationAccountToken1769715257791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "account_activation_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "used_at" TIMESTAMP, "person_id" uuid, CONSTRAINT "REL_2e2c5c4ee21ce136b231548d75" UNIQUE ("person_id"), CONSTRAINT "PK_5f924c4c02053190c8235a6449a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "account_activation_token" ADD CONSTRAINT "FK_2e2c5c4ee21ce136b231548d756" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_activation_token" DROP CONSTRAINT "FK_2e2c5c4ee21ce136b231548d756"`);
        await queryRunner.query(`DROP TABLE "account_activation_token"`);
    }

}
