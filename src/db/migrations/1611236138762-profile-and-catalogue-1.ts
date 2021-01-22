import { MigrationInterface, QueryRunner } from 'typeorm';

export class profileAndCatalogue11611236138762 implements MigrationInterface {
  name = 'profileAndCatalogue11611236138762';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "website" character varying`);
    await queryRunner.query(`ALTER TABLE "catalogue" ADD "photo" character varying`);
    await queryRunner.query(`CREATE INDEX "IDX_ca67c56142710cc0db80d702cc" ON "user" ("website") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_ca67c56142710cc0db80d702cc"`);
    await queryRunner.query(`ALTER TABLE "catalogue" DROP COLUMN "photo"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "website"`);
  }
}
