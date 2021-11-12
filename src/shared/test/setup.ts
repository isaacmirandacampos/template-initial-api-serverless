import knex from '../db';

afterAll(async () => {
  await knex.destroy();
});
