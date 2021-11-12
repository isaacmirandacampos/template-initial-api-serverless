import withApp from '../../shared/test/withApp';
import { fabricateUser } from '../../shared/test/factories';

describe('authentication:password recovery requests', () => {
  it(
    "should request change the user's password",
    withApp(async (app, trx) => {
      const userId = await fabricateUser(trx, {
        email: 'fulano@domain.com',
        password: 'algumasenha',
      });
      const resp = await app.inject({
        method: 'POST',
        url: `/v1/authentication/password-recoveries`,
        payload: {
          email: 'fulano@domain.com',
        },
      });
      expect(resp.statusCode).toEqual(204);
      const [emails] = await trx('password_definition_requests')
        .select('consumed')
        .where({ user_id: userId, consumed: false });
      expect(emails).toHaveProperty('consumed');
    })
  );

  it(
    'Must have request errors AccountNotSetup',
    withApp(async (app, trx) => {
      await fabricateUser(trx, {
        email: 'fulano@domain.com',
        password: undefined,
      });
      const resp = await app.inject({
        method: 'POST',
        url: `/v1/authentication/password-recoveries`,
        payload: {
          email: 'fulano@domain.com',
        },
      });
      expect(resp.statusCode).toEqual(422);
      expect(JSON.parse(resp.body)).toEqual({
        error: 'AccountNotSetup',
        description: 'Conta ainda não habilitada.',
      });
    })
  );
});
