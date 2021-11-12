import { FastifyRequest } from 'fastify';
import { Knex } from 'knex';

export interface FastifyRequestUnauthenticated extends FastifyRequest {
  uow: Knex.Transaction;
}

export interface FastifyRequestAuthentication extends FastifyRequest {
  uow: Knex.Transaction;
  userId: string;
}
