import { v4 as uuidv4 } from 'uuid';
import { FastifyReply, FastifySchema } from 'fastify';
import { FastifyRequestUnauthenticated } from '../../shared/fastify';
import { InvalidDataOrState } from '../../shared/error';

export const schema: FastifySchema = {
  body: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
      },
    },
    required: ['email'],
  },
};

interface RequestOptions extends FastifyRequestUnauthenticated {
  body: {
    email: string;
  };
}

const handler = async (req: RequestOptions, res: FastifyReply) => {
  const { email } = req.body;

  const [user] = await req.uow
    .from('users')
    .select('id', 'name', 'password')
    .where({ email });

  if (!user) {
    throw new InvalidDataOrState('UserNotFound', 'Usuário não encontrado.');
  }

  if (user.password) {
    throw new InvalidDataOrState(
      'UserAlreadyRegistered',
      'Esta conta já possui uma senha.'
    );
  }

  await req.uow
    .update({ consumed: true })
    .from('password_definition_requests')
    .where({ user_id: user.id, consumed: false });

  const requestId = uuidv4();
  await req.uow
    .insert({ user_id: user.id, id: requestId })
    .from('password_definition_requests');

  res.status(204).send({ hash: requestId });
};

export default { handler, schema };
