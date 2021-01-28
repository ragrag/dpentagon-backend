import { MigrationInterface, QueryRunner } from 'typeorm';

export class profilePrivacy1611865792031 implements MigrationInterface {
  name = 'profilePrivacy1611865792031';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "catalogue" DROP CONSTRAINT "FK_75b49d3535a351f1cdcb77781f9"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "private" boolean DEFAULT false`);
    await queryRunner.query(`CREATE INDEX "IDX_b3fa7cb474386571af4650b101" ON "user" ("private") `);
    await queryRunner.query(
      `ALTER TABLE "catalogue" ADD CONSTRAINT "FK_75b49d3535a351f1cdcb77781f9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "catalogue" DROP CONSTRAINT "FK_75b49d3535a351f1cdcb77781f9"`);
    await queryRunner.query(`DROP INDEX "IDX_b3fa7cb474386571af4650b101"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "private"`);
    await queryRunner.query(
      `ALTER TABLE "catalogue" ADD CONSTRAINT "FK_75b49d3535a351f1cdcb77781f9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
