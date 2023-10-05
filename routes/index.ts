import { Router } from 'express';
import * as db from './db';
import * as auth from './auth';
import { buildEndpoint } from 'libs/utils/buildEndpoint';
import { EndpointDetails } from 'libs/types';
const router = Router();

const allEndpoints = {
  ...auth,
  ...db,
};

Object.values(allEndpoints).forEach((details: EndpointDetails) => {
  const endpoint = buildEndpoint(details);
  //@ts-expect-error
  router[details.method](...endpoint);
});


router.get('/hello', (req, res) => {
  res.send({
    message: 'Hello World!',
  });
});

export { router };
