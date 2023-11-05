export const POSTGRES_PORT = 5432;
export const MYSQL_PORT = 3306;
export const MONGO_PORT = 27017;

export const ADMINER_PORT = 3015; // or whatever

export const MAX_DATABASES_PER_POD = 10;
export { MAX_GIGA_SIZE_PER_DATABASE } from 'src/fe-lib/constants/shared';
export const TOKEN_EXPIRE_IN = 60 * 60 * 2 * 1000; // 2 hours
export const REFRESH_TOKEN_EXPIRE_IN = 60 * 60 * 24 * 7; // 1 day
export const POD_STORAGE_GIGA = 1;
