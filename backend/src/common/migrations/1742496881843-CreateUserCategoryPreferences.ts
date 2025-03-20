import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserCategoryPreferences1742496881843
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create pivot table user_roles
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "user_category_preferences" (
          "id" SERIAL NOT NULL,
          "user_id" integer NOT NULL,
          "category_id" integer NOT NULL,
          "assigned_at" TIMESTAMP NOT NULL DEFAULT now(),
  
          CONSTRAINT "PK_user_category_preferences" PRIMARY KEY ("user_id", "category_id"),
          CONSTRAINT "FK_user_category_preferences_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
          CONSTRAINT "FK_user_category_preferences_category" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE
        )
      `);

    await queryRunner.query(`
        INSERT INTO "permissions" (name)
          VALUES 
              ('user_category_preference_create'),
              ('user_category_preference_read'),
              ('user_category_preference_update'),
              ('user_category_preference_delete');
  
        INSERT INTO "role_permission" (role_id, permission_id)
          SELECT r.id, p.id
          FROM roles r
          JOIN permissions p ON p.name IN (
              'user_category_preference_create',
              'user_category_preference_read',
              'user_category_preference_update',
              'user_category_preference_delete'
          )
          WHERE r.name IN ('super_admin', 'admin', 'user');
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user_category_preferences");
    await queryRunner.query(`
        DELETE FROM "permissions" WHERE name IN (
            'user_category_preference_create', 
            'user_category_preference_read',
            'user_category_preference_update',
            'user_category_preference_delete'
        );
    `);
  }
}
