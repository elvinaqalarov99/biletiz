// Migration to run on very first project setup to load data
// Do not run it if you already have a data!!!

import { MigrationInterface, QueryRunner } from "typeorm";
import * as argon2 from "argon2";

export class CreateRBACData1739547174729 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashedPassword = (await argon2.hash("admin123")).toString();
    await queryRunner.query(`
        INSERT INTO "users" (id, email, password)
        VALUES (1, 'super_admin@gmail.com', '${hashedPassword}');

        INSERT INTO "roles" (name, description)
        VALUES 
            ('super_admin', 'A role with all the privileges'),
            ('admin', 'A role with base admin privileges'),
            ('user', 'A role with base user privileges');

        INSERT INTO "permissions" (name)
        VALUES 
            ('user_create'),
            ('user_read'),
            ('user_update'),
            ('user_delete'),

            ('role_create'),
            ('role_read'),
            ('role_update'),
            ('role_delete'),

            ('permission_create'),
            ('permission_read'),
            ('permission_update'),
            ('permission_delete');

        INSERT INTO "user_role" (user_id, role_id)
        SELECT 1, r.id
        FROM roles r
        WHERE r.name IN ('super_admin', 'user');

        -- super admin permissions
        INSERT INTO "role_permission" (role_id, permission_id)
        SELECT r.id, p.id
        FROM roles r
        JOIN permissions p ON p.name IN (
            'user_create', 
            'user_read', 
            'user_update', 
            'user_delete',

            'role_create',
            'role_read',
            'role_update',
            'role_delete',

            'permission_create',
            'permission_read',
            'permission_update',
            'permission_delete'
        )
        WHERE r.name IN ('super_admin');

        -- admin permissions
        INSERT INTO "role_permission" (role_id, permission_id)
        SELECT r.id, p.id
        FROM roles r
        JOIN permissions p ON p.name IN (
            'user_create', 
            'user_read', 
            'user_update',

            'role_create',
            'role_read',
            'role_update',

            'permission_create',
            'permission_read',
            'permission_update'
        )
        WHERE r.name IN ('admin');
    `);
  }

  // No need for down method here
  public async down(): Promise<void> {}
}
