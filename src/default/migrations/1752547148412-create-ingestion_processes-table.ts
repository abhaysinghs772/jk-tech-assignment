import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateIngestionProcessesTable1752547148412 implements MigrationInterface {
    name = 'CreateIngestionProcessesTable1752547148412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."ingestion_processes_status_enum" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "ingestion_processes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."ingestion_processes_status_enum" NOT NULL DEFAULT 'PENDING', "startedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "completedAt" TIMESTAMP WITH TIME ZONE, "logs" text, "documentId" uuid, "triggeredById" uuid NOT NULL, CONSTRAINT "PK_0bfedab5e639bdc628224475f4b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ingestion_processes" ADD CONSTRAINT "FK_ea153f8a4e0f07f1213684ec831" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ingestion_processes" ADD CONSTRAINT "FK_9a19fd14fc89a1bf4faebe765ad" FOREIGN KEY ("triggeredById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingestion_processes" DROP CONSTRAINT "FK_9a19fd14fc89a1bf4faebe765ad"`);
        await queryRunner.query(`ALTER TABLE "ingestion_processes" DROP CONSTRAINT "FK_ea153f8a4e0f07f1213684ec831"`);
        await queryRunner.query(`DROP TABLE "ingestion_processes"`);
        await queryRunner.query(`DROP TYPE "public"."ingestion_processes_status_enum"`);
    }

}
