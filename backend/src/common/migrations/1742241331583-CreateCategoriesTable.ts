import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCategoriesTable1742241331583 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "categories",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "external_id",
            type: "int",
            isUnique: true,
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "slug",
            type: "varchar",
          },
          {
            name: "ordering",
            type: "int4",
          },
          {
            name: "external_url",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "deleted_at",
            type: "timestamp",
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.query(`
      INSERT INTO "permissions" (name)
        VALUES 
            ('category_read');

      INSERT INTO "role_permission" (role_id, permission_id)
        SELECT r.id, p.id
        FROM roles r
        JOIN permissions p ON p.name IN (
            'category_read'
        )
        WHERE r.name IN ('super_admin', 'admin', 'user');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("categories");
    await queryRunner.query(`
      DELETE FROM "permissions" WHERE name = 'category_read';
    `);
  }
}
