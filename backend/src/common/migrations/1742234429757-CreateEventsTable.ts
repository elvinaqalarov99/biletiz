import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateEventsTable1742234429757 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'events',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'external_id',
            type: 'int',
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'category_id',
            type: 'int',
          },
          {
            name: 'slug',
            type: 'varchar',
          },
          {
            name: 'age_limit',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'event_starts_at',
            type: 'timestamp',
          },
          {
            name: 'event_ends_at',
            type: 'timestamp',
          },
          {
            name: 'sell_ends_at',
            type: 'timestamp',
          },
          {
            name: 'available_tickets_count',
            type: 'int',
          },
          {
            name: 'upcoming_mode',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'min_price',
            type: 'int',
          },
          {
            name: 'max_price',
            type: 'int',
          },
          {
            name: 'poster_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'poster_bg_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'poster_wide_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'poster_wide_bg_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'public_state',
            type: 'int',
          },
          {
            name: 'web_view_rotate',
            type: 'boolean',
          },
          {
            name: 'search',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'external_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'meta_title',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'meta_description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'meta_keywords',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );

    // Add unique constraint to the "email" column of the "user" table
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "unique_external_id" UNIQUE ("external_id")`,
    );

    await queryRunner.query(`
      INSERT INTO "permissions" (name)
        VALUES 
            ('event_read');

      INSERT INTO "role_permission" (role_id, permission_id)
        SELECT r.id, p.id
        FROM roles r
        JOIN permissions p ON p.name IN (
            'event_read'
        )
        WHERE r.name IN ('super_admin', 'admin', 'user');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('events');
    await queryRunner.query(`
      DELETE FROM "permissions" WHERE name = 'event_read';
    `);
  }
}
