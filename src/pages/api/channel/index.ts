import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/middleware/dbConnect';
import authenticate from '@/middleware/authenticate';
import { createOrUpdateChannel } from '@/controllers/channel.controller';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      return authenticate(createOrUpdateChannel)(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default connectDB(handler);
