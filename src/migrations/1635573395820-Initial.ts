import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1635573395820 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE products ("id" SERIAL NOT NULL, "name" text NOT NULL, "category" text NOT NULL, "description" text NOT NULL, "short_description" text NOT NULL, "price" text NOT NULL, "sale_price" text NOT NULL, "regular_price" text NOT NULL, "stock_quantity" integer, "weight" text NOT NULL, "length" text NOT NULL, "width" text NOT NULL, "height" text NOT NULL, "related_ids" text array, "images" text, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`
    );

    await queryRunner.query(
      `CREATE TABLE users ("user_id" SERIAL NOT NULL, "first_Name" text NOT NULL, "last_Name" text NOT NULL, "email" text NOT NULL, "phoneNo" character varying, "type" character varying, "avatar_url" character varying, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "address_1" text, "address_2" text, "city" text, "postcode" text, "state" text, CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
