import {
  RouteOptions,
  HookHandlerDoneFunction,
  FastifyInstance,
} from 'fastify';
import login from './login';
import setupAccountRequest from './setup-account-request';
import passwordRecoveryRequest from './password-recovery-request';
import passwordDefinitionRequestFinish from './password-definition-request-finish';
export default (
  fastify: FastifyInstance,
  _opts: RouteOptions,
  done: HookHandlerDoneFunction
) => {
  fastify.post('/login', { schema: login.schema }, login.handler as any);

  fastify.post(
    '/setup-account-requests',
    { schema: setupAccountRequest.schema },
    setupAccountRequest.handler as any
  );

  fastify.post(
    '/password-recoveries',
    { schema: passwordRecoveryRequest.schema },
    passwordRecoveryRequest.handler as any
  );

  fastify.post(
    '/password-definition-requests/:hash/finish',
    { schema: passwordDefinitionRequestFinish.schema },
    passwordDefinitionRequestFinish.handler as any
  );

  done();
};
