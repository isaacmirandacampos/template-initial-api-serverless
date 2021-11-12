import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('users').insert([
    {
      id: '597191f3-8d90-4b89-8529-4648b9b3cb38',
      name: 'Fulano do MIT',
      email: 'fulano@domain.com',
    },
  ]);
}
