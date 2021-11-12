import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import withApp from '../../shared/test/withApp';
import {
  fabricatePasswordDefinitionRequest,
  fabricateUser,
} from '../../shared/test/factories';

describe('authentication:password definition requests:finish', () => {
  it(
    "should change the user's password",
    withApp(async (app, trx) => {
      const userId = await fabricateUser(trx, {
        email: 'fulano@domain.com',
        password: 'senhaanterior',
      });
      const hash = uuidv4();
      await fabricatePasswordDefinitionRequest(trx, {
        userId,
        id: hash,
        consumed: false,
      });
      const resp = await app.inject({
        method: 'POST',
        url: `/v1/authentication/password-definition-requests/${hash}/finish`,
        payload: {
          password: 'novasenha',
        },
      });
      expect(resp.statusCode).toEqual(204);
      const [user] = await trx('users')
        .select('password')
        .where('email', 'fulano@domain.com');
      expect(bcrypt.compareSync('novasenha', user?.password)).toBeTruthy();
      const [{ consumed }] = await trx('password_definition_requests')
        .select('consumed')
        .where('id', hash);
      expect(consumed).toBeTruthy();
    })
  );

  it(
    'should deny the operation if the request is already consumed',
    withApp(async (app, trx) => {
      const userId = await fabricateUser(trx, {
        email: 'fulano@domain.com',
        password: 'senhaanterior',
      });
      const hash = uuidv4();
      await fabricatePasswordDefinitionRequest(trx, {
        userId,
        id: hash,
        consumed: true,
      });
      const resp = await app.inject({
        method: 'POST',
        url: `/v1/authentication/password-definition-requests/${hash}/finish`,
        payload: {
          password: 'novasenha',
        },
      });
      expect(resp.statusCode).toEqual(422);
      expect(JSON.parse(resp.body)).toEqual({
        error: 'PasswordDefinitionAlreadyConsumed',
        description: 'Este link já foi utilizado.',
      });
    })
  );
});
