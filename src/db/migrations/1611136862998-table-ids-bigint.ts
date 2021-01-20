import { MigrationInterface, QueryRunner } from 'typeorm';

export class tableIdsBigint1611136862998 implements MigrationInterface {
  name = 'tableIdsBigint1611136862998';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee"`);
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "post" ADD "id" BIGSERIAL NOT NULL`);
    await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee"`);
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "post" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id")`);
  }
}
