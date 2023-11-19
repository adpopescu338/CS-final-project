export const POSTGRES_PORT = 5432;
export const MYSQL_PORT = 3306;
export const MONGO_PORT = 27017;

export const ADMINER_PORT = 3015; // or whatever

export const MAX_DATABASES_PER_POD = 10;
export const MAX_GIGA_SIZE_PER_DATABASE = 0.2;

export enum ErrorCodes {
  NotFound = 'NOT_FOUND',
  Unauthorized = 'UNAUTHORIZED',
  Forbidden = 'FORBIDDEN',
  BadRequest = 'BAD_REQUEST',
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  ResourceAlreadyExists = 'RESOURCE_ALREADY_EXISTS',
}
