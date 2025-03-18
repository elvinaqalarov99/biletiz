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

    // Create pivot table user_roles
    await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS "event_venue" (
            "id" SERIAL NOT NULL,
            "event_id" integer NOT NULL,
            "venue_id" integer NOT NULL,
            "assigned_at" TIMESTAMP NOT NULL DEFAULT now(),
    
            CONSTRAINT "PK_event_venue" PRIMARY KEY ("event_id", "venue_id"),
            CONSTRAINT "FK_event_venue_event" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE,
            CONSTRAINT "FK_event_venue_venue" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE CASCADE
          )
        `);

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
    await queryRunner.dropTable("event_venue");
    await queryRunner.dropTable("venues");
    await queryRunner.query(`
      DELETE FROM "permissions" WHERE name = 'venue_read';
    `);
  }
}
