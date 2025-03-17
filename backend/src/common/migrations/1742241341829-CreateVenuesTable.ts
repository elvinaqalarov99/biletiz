import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateVenuesTable1742241341829 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "venues",
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
            name: "map_lat",
            type: "varchar",
          },
          {
            name: "map_lng",
            type: "varchar",
          },
          {
            name: "phone",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "mobile",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
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
            ('venue_read');

      INSERT INTO "role_permission" (role_id, permission_id)
        SELECT r.id, p.id
        FROM roles r
        JOIN permissions p ON p.name IN (
            'venue_read'
        )
        WHERE r.name IN ('super_admin', 'admin', 'user');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("venues");
    await queryRunner.query(`
      DELETE FROM "permissions" WHERE name = 'venue_read';
    `);
  }
}
