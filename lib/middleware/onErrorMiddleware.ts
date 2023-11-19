import { BeError } from 'lib/BeError';
import { NextApiRequest, NextApiResponse } from 'next';

export function onErrorMiddleware(
  error: BeError,
  request: NextApiRequest,
  response: NextApiResponse
) {
  const path = request.url?.split('?')[0] || request.url;
  console.log(`Error occurred at ${path}: `, error);

  if (error instanceof BeError) {
    return response.status(error.statusCode ?? 500).json({
      message: error.message,
      path,
      date: new Date().toISOString(),
      code: error.code,
      status: error.statusCode,
    });
  }
  return response.status(500).json({
    status: 500,
    message: 'An unknown error occurred',
  });
}
