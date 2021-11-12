import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').notNullable().primary();
    table.text('name').notNullable();
    table.text('email').notNullable().unique();
    table.text('password');
    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });
}

export async function down(): Promise<void> {
  throw new Error();
}
