import bcrypt from 'bcrypt';
import { FastifyReply, FastifySchema } from 'fastify';
import { InvalidDataOrState } from '../../shared/error';
import { FastifyRequestUnauthenticated } from '../../shared/fastify';
import signToken from '../../shared/helpers/signToken';

export const schema: FastifySchema = {
  body: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
    },
    required: ['email', 'password'],
  },
};

interface RequestOptions extends FastifyRequestUnauthenticated {
  body: {
    email: string;
    password: string;
  };
}

const handler = async (req: RequestOptions, res: FastifyReply) => {
  const { email, password } = req.body;

  const [user] = await req.uow
    .select('email', 'password', 'id')
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

  if (!bcrypt.compareSync(password, user.password)) {
    throw new InvalidDataOrState('InvalidCredentials', 'Senha incorreta.');
  }

  res.status(200).send({ token: signToken(user.id) });
};

export default { handler, schema };
