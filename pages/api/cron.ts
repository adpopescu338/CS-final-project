import { Cron } from 'lib/cron/Cron';
import { apiHandler } from 'lib/middleware';
import { NextApiResponse, NextApiRequest } from 'next';

const logic = async (req: NextApiRequest, res: NextApiResponse) => {
  Cron.start();

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (!['::1', 'localhost'].includes(ip as string)) {
    res.status(404).end();
    return;
  }

  res.status(200).json({
    success: true,
  });
};

export default apiHandler().get(logic);
