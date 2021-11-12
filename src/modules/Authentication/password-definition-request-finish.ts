import bcrypt from 'bcrypt';
import { FastifyReply, FastifySchema } from 'fastify';
import { BadRequest, InvalidDataOrState } from '../../shared/error';
import { FastifyRequestUnauthenticated } from '../../shared/fastify';

export const schema: FastifySchema = {
  body: {
    type: 'object',
    properties: {
      password: {
        type: 'string',
        minLength: 6,
      },
    },
    required: ['password'],
  },
};

interface RequestOptions extends FastifyRequestUnauthenticated {
  params: {
    hash: string;
  };
  body: {
    password: string;
  };
}

const handler = async (req: RequestOptions, res: FastifyReply) => {
  const { password } = req.body;
  const { hash } = req.params;

  const [email] = await req.uow
    .select(['user_id', 'created_at', 'consumed'])
    .where({ id: hash })
    .from('password_definition_requests');

  if (!email) {
    throw new BadRequest('Password definition request not found.');
  }

  if (email.consumed) {
    throw new InvalidDataOrState(
      'PasswordDefinitionAlreadyConsumed',
      'Este link já foi utilizado.'
    );
  }

  await req.uow
    .where({ id: email.user_id })
    .from('users')
    .update({ password: bcrypt.hashSync(password, 10) });

  await req.uow
    .update({ consumed: true })
    .where({ id: hash, consumed: false })
    .from('password_definition_requests');

  res.status(204).send();
};

export default { handler, schema };
