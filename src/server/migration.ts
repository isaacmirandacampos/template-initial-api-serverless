import db from '../shared/db';

export const lambdaHandler = async () => {
  try {
    console.info('run migrations');
    await db.migrate.latest({
      directory: './shared/db/migrations',
      loadExtensions: ['.js'],
    });
    console.info('migrations finished');
  } catch (error) {
    throw new Error(error);
  } finally {
    await db.destroy();
  }
};
