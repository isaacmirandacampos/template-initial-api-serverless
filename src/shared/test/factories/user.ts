import { v4 as uuidv4 } from 'uuid';
import { Knex } from 'knex';
import bcrypt from 'bcrypt';

interface UserParams {
  password?: string | undefined;
  email: string;
  name?: string | undefined;
}

export default async (
  uow: Knex.Transaction,
  { email, password, name = 'John Doe' }: UserParams
) => {
  const id = uuidv4();
  await uow('users').insert({
    email,
    password: password === undefined ? null : bcrypt.hashSync(password, 10),
    name,
    id,
  });
  return id;
};
