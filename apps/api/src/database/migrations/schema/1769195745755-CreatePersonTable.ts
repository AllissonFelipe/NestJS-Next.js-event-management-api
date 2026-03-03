/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePersonTable1769195745755 implements MigrationInterface {
    name = 'CreatePersonTable1769195745755'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "person" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying NOT NULL, "cpf" character varying NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_264b7cad2330569e0ef5b4c39c4" UNIQUE ("cpf"), CONSTRAINT "UQ_d2d717efd90709ebd3cb26b936c" UNIQUE ("email"), CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "person"`);
    }

}
