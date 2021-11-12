import debugFactory from 'debug';
import { FastifyInstance } from 'fastify';
import { Knex } from 'knex';
import App from '../../server/App';
import db from '../db';

const debug = debugFactory('api:withApp');

const withApp =
  (callback: (app: FastifyInstance, trx: Knex.Transaction) => Promise<void>) =>
  async (): Promise<void> => {
    const app = new App().server;
    await db.transaction(async (trx) => {
      app.addHook('preHandler', (req: any, _reply: any, done: any) => {
        req.uow = trx;
        done();
      });
      try {
        await callback(app, trx);
        await trx.rollback();
      } catch (err) {
        debug('error %O', err);
        throw err;
      } finally {
        app.close();
      }
    });
  };

export default withApp;
