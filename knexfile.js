// import Confidence from 'confidence';
const Confidence = require('confidence');
const AppManifestJson = require('./src/config/app.json');

require('dotenv').config();

const AppManifest = new Confidence.Store(AppManifestJson).get('/', {
  env: process.env.NODE_ENV,
});

module.exports = {
  development: {
    client: 'postgresql',
    debug: true,
    connection: {
      database: AppManifest.db.pg.dbname,
      user: AppManifest.db.pg.username,
      password: AppManifest.db.pg.password,
    },
    pool: {
      min: Number(AppManifest.db.pg.pool.min),
      max: Number(AppManifest.db.pg.pool.max),
    },
    migrations: {
      directory: `${__dirname}/db/migrations`,
      tableName: AppManifest.knex.migration_table,
    },
    seeds: {
      directory: `${__dirname}/db/seeds/development`,
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: `${__dirname}/db/seeds/staging`,
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: AppManifest.db.pg.dbname,
      user: AppManifest.db.pg.username,
      password: AppManifest.db.pg.password,
    },
    pool: {
      min: Number(AppManifest.db.pg.pool.min),
      max: Number(AppManifest.db.pg.pool.max),
    },
    migrations: {
      tableName: AppManifest.knex.migration_table,
    },
    seeds: {
      directory: `${__dirname}/db/seeds/production`,
    },
  },
};
