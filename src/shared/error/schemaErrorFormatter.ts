import { BadRequest } from './types';

export default (errors: any) => {
  throw new BadRequest('Failed schema validation', errors);
};
