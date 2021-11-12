import { Knex } from 'knex';
import awsLambdaFastify from 'aws-lambda-fastify';

import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import App from './App';
import db from '../shared/db';

const app = new App();

interface RequestOptions extends FastifyRequest {
  uow?: Knex.Transaction;
}

app.server.addHook(
  'preHandler',
  (
    req: RequestOptions,
    _reply: FastifyReply,
    done: HookHandlerDoneFunction
  ) => {
    db.transaction((trx: Knex.Transaction) => {
      req.uow = trx;
      done();
    }).catch(done);
  }
);

app.server.addHook(
  'onResponse',
  async (req: RequestOptions, reply: FastifyReply) => {
    if (req.uow) {
      if (reply.statusCode >= 200 && reply.statusCode < 300) {
        await req.uow.commit();
      } else {
        await req.uow.rollback();
      }
    }
  }
);

export const lambdaHandler = awsLambdaFastify(app.server, {
  callbackWaitsForEmptyEventLoop: false,
});

if (require.main === module) {
  app.server.listen(5012, () => {
    console.log('server listening on 5012');
  });
}
