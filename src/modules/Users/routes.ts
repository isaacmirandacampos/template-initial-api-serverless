import {
  RouteOptions,
  HookHandlerDoneFunction,
  FastifyInstance,
} from 'fastify';
import me from './fetch-me';
import auth from '../../shared/middlewares/auth';

export default (
  fastify: FastifyInstance,
  _opts: RouteOptions,
  done: HookHandlerDoneFunction
) => {
  fastify.get('/me', { preHandler: auth }, me.handler as any);

  done();
};
