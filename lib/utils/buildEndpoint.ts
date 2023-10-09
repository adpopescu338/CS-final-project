import { EndpointDetails } from 'libs/types';
import { asyncHandler, validate } from 'libs/middleware';
import { auth } from 'libs/middleware';
import { Schema } from 'yup';

type EndpointArgs = [string, ...(typeof auth | Schema | typeof asyncHandler)[]];

export const buildEndpoint = (details: EndpointDetails): EndpointArgs => {
  const { path, logic, schema, withAuth } = details;

  const endpoint: EndpointArgs = [path.startsWith('/') ? path : `/${path}`];

  if (withAuth) {
    endpoint.push(auth);
  }
  if (schema) {
    endpoint.push(validate(schema));
  }

  endpoint.push(asyncHandler(logic));
  return endpoint;
};