import { ErrorCodes } from 'lib/constants';

const statusCodes = {
  [ErrorCodes.NotFound]: 404,
  [ErrorCodes.Unauthorized]: 401,
  [ErrorCodes.Forbidden]: 403,
  [ErrorCodes.BadRequest]: 400,
  [ErrorCodes.InternalServerError]: 500,
  [ErrorCodes.ResourceAlreadyExists]: 409,
};

export class BeError extends Error {
  code: ErrorCodes;
  statusCode?: number;
  constructor(message: string, code: ErrorCodes, statusCode?: number) {
    super(message);
    this.message = message;
    this.code = code;
    this.statusCode = statusCode || statusCodes[code];
  }
}
