import { BeError } from '../BeError';

export const errorHandler = (error, request, response, next) => {
  const path = request.path;
  console.log(`Error occurred at ${path}: `, error);

  if (error instanceof BeError) {
    return response.status(error.statusCode).json({
      message: error.message,
      path: request.path,
      date: new Date().toISOString(),
      code: error.code,
      status: error.statusCode,
    });
  }
  return response.status(500).json({
    status: 500,
    message: 'An unknown error occurred',
  });
};
