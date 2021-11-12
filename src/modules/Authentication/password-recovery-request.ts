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
    .select('id', 'name', 'password')
    .from('users')
    .where({ email });

  if (!user) {
    throw new InvalidDataOrState('UserNotFound', 'Usuário não encontrado.');
  }

  if (!user.password) {
    throw new InvalidDataOrState(
      'AccountNotSetup',
      'Conta ainda não habilitada.'
    );
  }

  const requestId = uuidv4();
  await req.uow
    .insert({ user_id: user.id, id: requestId, consumed: false })
    .from('password_definition_requests');

  res.status(200).send({ hash: requestId });
};

export default { handler, schema };
