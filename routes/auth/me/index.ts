import { asyncHandler } from 'libs/middleware';
import { logic } from './logic';

const endpoint = {
  handler: asyncHandler(logic),
};

export default endpoint;
