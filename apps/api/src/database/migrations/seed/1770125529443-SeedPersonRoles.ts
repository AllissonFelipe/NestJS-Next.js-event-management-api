/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { randomUUID } from 'crypto';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedPersonRoles1770125529443 implements MigrationInterface {
    name = 'SeedPersonRoles1770125529443';
    public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      INSERT INTO person_role (id, role, created_at, updated_at)
      VALUES
        ($1, 'USER', NOW(), NOW()),
        ($2, 'ADMIN', NOW(), NOW())
      ON CONFLICT (role) DO NOTHING
      `,
      [randomUUID(), randomUUID()],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {

  }
}
