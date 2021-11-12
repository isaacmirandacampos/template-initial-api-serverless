import withApp from '../../shared/test/withApp';
import { fabricateAuthToken } from '../../shared/test/factories';

describe('users:me', () => {
  it(
    'should fetch user data',
    withApp(async (app, trx) => {
      const res = await app.inject({
        method: 'GET',
        url: '/v1/users/me',
        headers: await fabricateAuthToken(trx, {
          email: 'fulano@domain.com',
          password: 'strongPassword',
          name: 'fulano',
        }),
      });
      expect(res.statusCode).toEqual(200);
      expect(JSON.parse(res.body).user).toEqual({
        email: 'fulano@domain.com',
        name: 'fulano',
      });
    })
  );
});
