import knex from 'knex';
import { InternalServerError } from '../error';

export default knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
}).on('query-error', (error) => {
  throw new InternalServerError(error);
});
