export { mongoManager } from './mongo';
export { mysqlManager } from './mysql';
export { postgresManager } from './postgres';

export enum DatabaseType {
  mongo = 'mongo',
  mysql = 'mysql',
  postgres = 'postgres',
}
