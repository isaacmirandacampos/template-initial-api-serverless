import { FastifyRequest, FastifyReply } from 'fastify';
import debugFactory from 'debug';
import {
  BadRequest,
  InvalidDataOrState,
  Unauthenticated,
  Unauthorized,
  InternalServerError,
} from './types';

const debug = debugFactory('api:error:handler');

type ErrorParams =
  | InvalidDataOrState
  | InternalServerError
  | Unauthenticated
  | Unauthorized
  | BadRequest
  | Error;

const errorHandler = (
  err: ErrorParams,
  _req: FastifyRequest,
  reply: FastifyReply
) => {
  if ('cause' in err) {
    debug('internal server error %O', err.cause);
  } else if (!('kind' in err) || err.kind === 'bad-request') {
    debug('handling unexpected error %O', err);
  }

  let statusCode: number;
  if ('statusCode' in err) {
    statusCode = err.statusCode;
  } else {
    statusCode = 500;
  }

  let response;
  if ('kind' in err) {
    if (err.kind === 'invalid-data-or-state') {
      response = {
        error: err.error,
        description: err.message,
        details: err.details,
      };
    } else if (err.kind === 'unauthenticated') {
      response = {
        error: err.error,
      };
    } else {
      // bad-request
      statusCode = err.statusCode;
      response = {
        reason: err.reason,
        extra: err.extra,
      };
    }
  } else {
    response = {
      reason: err.message || 'Unknown server error.',
    };
  }

  reply.status(statusCode).send(response);
};

export default errorHandler;
