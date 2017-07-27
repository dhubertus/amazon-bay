module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/DATABAS_ENAME',
    migrations: {
      directory: 'db/migrations'
    },
    seeds: {
      directory: 'db/seeds/dev'
    },
    useNullAsDefault: true
  },
  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/DATABASE_NAME',
    migrations: {
      directory: 'db/migrations'
    },
    seeds: {
      directory: 'db/seeds/test'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + `?ssl=true`,
    migrations: {
      directory: 'db/migrations'
    },
    seeds: {
      directory: 'db/seeds/dev'
    },
    useNullAsDefault: true
  }
};
