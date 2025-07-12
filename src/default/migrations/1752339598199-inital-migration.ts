import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitalMigration1752339598199 implements MigrationInterface {
  name = 'InitalMigration1752339598199';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "idempotency_keys" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "idempotencyKey" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "response" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c9d085d0ce4d9c8f67133d1ed37" UNIQUE ("idempotencyKey"), CONSTRAINT "PK_8ad20779ad0411107a56e53d0f6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_roles_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "mobile" character varying, "email" character varying NOT NULL, "password" character varying, "is_active" boolean NOT NULL DEFAULT true, "last_login_at" TIMESTAMP, "roles" "public"."user_roles_enum", "refresh_token" character varying, "otp" character varying, "refresh_token_expiry" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_roles_enum"`);
    await queryRunner.query(`DROP TABLE "idempotency_keys"`);
  }
}
