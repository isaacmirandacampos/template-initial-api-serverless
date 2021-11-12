import { Knex } from 'knex';
import fabricateUser from './user';
import signToken from '../../helpers/signToken';

interface FabricateUserParams {
  email?: string | undefined;
  password?: string | undefined;
  name?: string | undefined;
}

export default async (
  trx: Knex.Transaction,
  data?: FabricateUserParams | undefined
) => {
  const id = await fabricateUser(trx, {
    email: data?.email || 'mock@email.com',
    password: data?.password || 'mock-pass',
    name: data?.name || 'fulano',
  });
  const token = signToken(id);
  return { authorization: `Bearer ${token}` };
};
