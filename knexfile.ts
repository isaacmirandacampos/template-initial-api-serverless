module.exports = {
  development: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: { min: 1, max: 1 },
    migrations: {
      directory: './src/shared/db/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/shared/db/seeds',
      extension: 'ts',
    },
  },
};
