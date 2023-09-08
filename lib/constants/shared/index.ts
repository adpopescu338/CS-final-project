export enum ErrorCodes {
  NotFound = 'NOT_FOUND',
  Unauthorized = 'UNAUTHORIZED',
  Forbidden = 'FORBIDDEN',
  BadRequest = 'BAD_REQUEST',
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  ResourceAlreadyExists = 'RESOURCE_ALREADY_EXISTS',
}

export const MAX_DATABASES_PER_USER = 3;
export const MAX_DATABASES_ACC_SIZE = /**250 MB */ 250 * 1024 * 1024;
