import { MigrationInterface, QueryRunner } from 'typeorm';

export class dbChanges1611088258236 implements MigrationInterface {
  name = 'dbChanges1611088258236';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"`);
    await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_b827264a8efb2a93cf0b7b2842e"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_f2831fa0e27b0cbca51bbce803d"`);
    await queryRunner.query(
      `CREATE TABLE "profession" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_7a54f88e18eaeb628aef171dc52" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "catalogue" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_bec0fb964fb313319998ebb7480" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "post" ADD "catalogueId" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD "emailConfirmed" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "user" ADD "coverPhoto" character varying`);
    await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying`);
    await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "caption" DROP NOT NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "post"."caption" IS NULL`);
    await queryRunner.query(`ALTER TYPE "public"."user_usertype_enum" RENAME TO "user_usertype_enum_old"`);
    await queryRunner.query(`CREATE TYPE "user_usertype_enum" AS ENUM('company', 'freelancer')`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "userType" TYPE "user_usertype_enum" USING "userType"::"text"::"user_usertype_enum"`);
    await queryRunner.query(`DROP TYPE "user_usertype_enum_old"`);
    await queryRunner.query(`COMMENT ON COLUMN "user"."userType" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "user"."profileInfo" IS NULL`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "profileInfo" SET DEFAULT ''`);
    await queryRunner.query(`CREATE INDEX "IDX_b827264a8efb2a93cf0b7b2842" ON "post" ("professionId") `);
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_b827264a8efb2a93cf0b7b2842e" FOREIGN KEY ("professionId") REFERENCES "profession"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_5d9cfd863af5f6587da348f7303" FOREIGN KEY ("catalogueId") REFERENCES "catalogue"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_f2831fa0e27b0cbca51bbce803d" FOREIGN KEY ("professionId") REFERENCES "profession"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "catalogue" ADD CONSTRAINT "FK_75b49d3535a351f1cdcb77781f9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "catalogue" DROP CONSTRAINT "FK_75b49d3535a351f1cdcb77781f9"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_f2831fa0e27b0cbca51bbce803d"`);
    await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_5d9cfd863af5f6587da348f7303"`);
    await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_b827264a8efb2a93cf0b7b2842e"`);
    await queryRunner.query(`DROP INDEX "IDX_b827264a8efb2a93cf0b7b2842"`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "profileInfo" DROP DEFAULT`);
    await queryRunner.query(`COMMENT ON COLUMN "user"."profileInfo" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "user"."userType" IS NULL`);
    await queryRunner.query(`CREATE TYPE "user_usertype_enum_old" AS ENUM('company', 'personal')`);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "userType" TYPE "user_usertype_enum_old" USING "userType"::"text"::"user_usertype_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "user_usertype_enum"`);
    await queryRunner.query(`ALTER TYPE "user_usertype_enum_old" RENAME TO  "user_usertype_enum"`);
    await queryRunner.query(`COMMENT ON COLUMN "post"."caption" IS NULL`);
    await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "caption" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "coverPhoto"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailConfirmed"`);
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "catalogueId"`);
    await queryRunner.query(`ALTER TABLE "post" ADD "userId" integer NOT NULL`);
    await queryRunner.query(`DROP TABLE "catalogue"`);
    await queryRunner.query(`DROP TABLE "profession"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_f2831fa0e27b0cbca51bbce803d" FOREIGN KEY ("professionId") REFERENCES "Profession"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_b827264a8efb2a93cf0b7b2842e" FOREIGN KEY ("professionId") REFERENCES "Profession"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
