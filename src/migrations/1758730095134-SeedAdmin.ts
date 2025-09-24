import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedAdmin1758730095134 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
  const password = '$2b$10$aotzVNQjxwN2pClimbtOQ.1ZHh0zZ2cwFzUUXYetuWW1Y597umt3.';

    await queryRunner.query(`
      INSERT INTO "users" (id, name, email, password, role, status, "createdAt", "updatedAt")
      VALUES (uuid_generate_v4(), 'Admin', 'admin@example.com', '${password}', 'admin', 'active', now(), now())
      ON CONFLICT (email) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "users" WHERE email = 'admin@example.com';
    `);
  }
}
