import { MigrationInterface, QueryRunner } from "typeorm";

export class NewTablePayments1774543972893 implements MigrationInterface {
    name = 'NewTablePayments1774543972893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payments_provider_enum" AS ENUM('STRIPE', 'MERCADO_PAGO', 'PAGSEGURO', 'PAYPAL')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_payment_method_enum" AS ENUM('PIX', 'BOLETO', 'CREDIT_CARD')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'PAID', 'FAILED', 'REFUNDED', 'CANCELED', 'EXPIRED')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "provider" "public"."payments_provider_enum" NOT NULL, "external_session_id" character varying, "external_payment_id" character varying, "payment_url" character varying, "payment_method" "public"."payments_payment_method_enum", "amount" numeric(10,2) NOT NULL, "currency" character varying NOT NULL DEFAULT 'BRL', "status" "public"."payments_status_enum" NOT NULL, "paid_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "subscription_id" uuid, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_75848dfef07fd19027e08ca81d2" FOREIGN KEY ("subscription_id") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_75848dfef07fd19027e08ca81d2"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_payment_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_provider_enum"`);
    }

}
