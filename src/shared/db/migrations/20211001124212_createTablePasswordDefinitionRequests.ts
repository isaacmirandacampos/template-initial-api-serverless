import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('password_definition_requests', (table) => {
    table.uuid('id').primary().notNullable().unique();
    table.uuid('user_id').references('id').inTable('users');
    table.boolean('consumed').defaultTo(false);
    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });
}

export async function down(): Promise<void> {
  throw new Error();
}
