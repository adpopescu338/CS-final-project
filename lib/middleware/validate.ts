import { NextApiRequest, NextApiResponse } from 'next';
import yup from 'yup';

export const validate = (
  schema?: yup.Schema<{
    body: Record<string, unknown>;
    query: Record<string, unknown>;
  }>
) => {
  if (!schema || !Object.keys(schema).length)
    return (req: NextApiRequest, res: NextApiResponse, next: () => void) => next();

  return async (req: NextApiRequest, res: NextApiResponse, next) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
      });
      return next();
    } catch (err) {
      return res.status(400).json({ type: err.name, message: err.message });
    }
  };
};
