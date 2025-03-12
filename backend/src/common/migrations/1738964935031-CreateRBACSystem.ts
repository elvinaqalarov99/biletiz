import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRBACSystem1614795827687 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "first_name" character varying NULL,
        "last_name" character varying NULL,
        "phone_number" character varying NULL,
        "profile_picture" character varying NULL,
        "date_of_birth" TIMESTAMP NULL,
        "address" character varying NULL,
        "email_verified" boolean NOT NULL DEFAULT false,
        "two_factor_enabled" boolean NOT NULL DEFAULT false,
        "failed_login_attempts" integer NOT NULL DEFAULT 0,
        "lastLogin_at" TIMESTAMP NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP NULL,

        CONSTRAINT "PK_user_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_email" UNIQUE ("email")
      )
    `);

    // Create roles table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "roles" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "description" text,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),

        CONSTRAINT "PK_role_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_role_name" UNIQUE ("name")
      )
    `);

    // Create permissions table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "permissions" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "description" text,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),

        CONSTRAINT "PK_permission_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_permission_name" UNIQUE ("name")
      )
    `);

    // Create pivot table user_roles
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_role" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "role_id" integer NOT NULL,
        "assigned_at" TIMESTAMP NOT NULL DEFAULT now(),

        CONSTRAINT "PK_user_role" PRIMARY KEY ("user_id", "role_id"),
        CONSTRAINT "FK_user_role_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_role_role" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE
      )
    `);

    // Create pivot table role_permissions
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "role_permission" (
        "id" SERIAL NOT NULL,
        "role_id" integer NOT NULL,
        "permission_id" integer NOT NULL,

        CONSTRAINT "PK_role_permissions" PRIMARY KEY ("role_id", "permission_id"),
        CONSTRAINT "FK_role_permissions_role" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_role_permissions_permission" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    // Add CASCADE to automatically drop dependent entities
    await queryRunner.query('DROP TABLE IF EXISTS "role_permission" CASCADE');
    await queryRunner.query('DROP TABLE IF EXISTS "user_role" CASCADE');
    await queryRunner.query('DROP TABLE IF EXISTS "permissions" CASCADE');
    await queryRunner.query('DROP TABLE IF EXISTS "roles" CASCADE');
    await queryRunner.query('DROP TABLE IF EXISTS "users" CASCADE');
  }
}
