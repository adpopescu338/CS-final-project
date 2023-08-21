import { BeError } from '../BeError';

export const errorHandler = (error, request, response, next) => {
  console.error(error);

  if (error instanceof BeError) {
    return response.status(error.statusCode).json({
      message: error.message,
      path: request.path,
      date: new Date().toISOString(),
      code: error.code,
    });
  }
  return response.status(500).json({ message: 'An unknown error occurred' });
};
