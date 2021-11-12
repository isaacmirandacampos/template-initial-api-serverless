import { Knex } from 'knex';

interface PasswordDefinitionRequestParams {
  id: string;
  userId: string;
  consumed: boolean;
}

export default async (
  uow: Knex.Transaction,
  { id, userId, consumed }: PasswordDefinitionRequestParams
) => {
  await uow('password_definition_requests').insert({
    id,
    user_id: userId,
    consumed,
  });
};
