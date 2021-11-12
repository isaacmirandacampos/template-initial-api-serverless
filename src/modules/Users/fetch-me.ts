import { FastifyReply } from 'fastify';
import { FastifyRequestAuthentication } from '../../shared/fastify';

const handler = async (
  req: FastifyRequestAuthentication,
  res: FastifyReply
) => {
  const [user] = await req.uow
    .select('email', 'name')
    .from('users')
    .where({ id: req.userId });

  res.status(200).send({ user });
};

export default { handler };
