module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/library_patrons',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  }
};
