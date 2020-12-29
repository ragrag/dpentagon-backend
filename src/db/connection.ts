import { ConnectionOptions } from 'typeorm';

const env = process.env.NODE_ENV || 'development';
const dbConnectionUrls = {
  production: process.env.DATABASE_URL,
  development: process.env.DATABASE_URL_DEV,
  testing: process.env.DATABASE_URL_TEST,
};

const dbConnection: ConnectionOptions = {
  url: dbConnectionUrls[env],
  type: 'postgres',
  synchronize: env === 'production' ? false : true,
  logging: false,
  entities: [env === 'production' ? 'build/entities/*{.ts,.js}' : 'src/entities/*{.ts,.js}'],
  migrations: [env === 'production' ? 'build/db/migrations/*{.ts,.js}' : 'src/db/migrations/*{.ts,.js}'],
  subscribers: [env === 'production' ? 'build/db/subscribers/*{.ts,.js}' : 'src/db/subscribers/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/db/migrations',
    subscribersDir: 'src/db/subscribers',
  },
  migrationsRun: true,
};

export = dbConnection;
