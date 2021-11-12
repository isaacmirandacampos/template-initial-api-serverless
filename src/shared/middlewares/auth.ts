import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { Unauthenticated } from '../error';

interface RequestParams extends FastifyRequest {
  userId?: string | undefined;
}

const auth = async (req: RequestParams, _res: FastifyReply, done?: any) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new Unauthenticated('missing-token');
  }
  jwt.verify(
    authorization.replace('Bearer ', ''),
    process.env.JWT_SECRET,
    (err: any, decoded: any): any => {
      if (err) {
        throw new Unauthenticated('invalid-token');
      }
      req.userId = decoded.id;
      done();
    }
  );
};
export default auth;
