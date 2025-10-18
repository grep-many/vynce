import { getSubscribedChannels } from '@/controllers/channel.controller';
import authenticate from '@/middleware/authenticate';
import connectDB from '@/middleware/dbConnect';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return authenticate(getSubscribedChannels)(req, res);
    default:
      return res.status(405).json({
        message: 'Invalid method!',
      });
  }
};

export default connectDB(handler);
