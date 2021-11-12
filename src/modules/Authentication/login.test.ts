import withApp from '../../shared/test/withApp';
import { fabricateUser } from '../../shared/test/factories';

describe('authentication:login', () => {
  it(
    'should accept valid credentials',
    withApp(async (app, trx) => {
      await fabricateUser(trx, {
        email: 'fulano@domain.com',
        password: 'strongPassword',
      });
      const res = await app.inject({
        method: 'POST',
        url: '/v1/authentication/login',
        payload: {
          email: 'fulano@domain.com',
          password: 'strongPassword',
        },
      });
      expect(res.statusCode).toEqual(200);
      expect(JSON.parse(res.body).token).toBeTruthy();
    })
  );

  it(
    'should reject invalid credentials',
    withApp(async (app, trx) => {
      await fabricateUser(trx, {
        email: 'fulano@domain.com',
        password: 'strongPassword',
      });
      const res = await app.inject({
        method: 'POST',
        url: '/v1/authentication/login',
        payload: {
          email: 'fulano@domain.com',
          password: 'hackerman',
        },
      });
      expect(res.statusCode).toEqual(422);
      expect(JSON.parse(res.body)).toEqual({
        error: 'InvalidCredentials',
        description: 'Senha incorreta.',
      });
    })
  );
});
