import { getChannelById, toggleSubscription } from '@/controllers/channel.controller';
import authenticate from '@/middleware/authenticate';
import connectDB from '@/middleware/dbConnect';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return getChannelById(req, res);
    case 'PUT':
      return authenticate(toggleSubscription)(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
  
};

export default connectDB(handler);
