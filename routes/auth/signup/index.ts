import { asyncHandler, validate } from 'libs/middleware';
import { schema } from './schemas';
import { logic } from './logic';

const endpoint = {
  validate: validate(schema),
  handler: asyncHandler(logic),
};

export default endpoint;
