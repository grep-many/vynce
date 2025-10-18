import { getChannelById } from '@/controllers/channel.controller';
import connectDB from '@/middleware/dbConnect';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return getChannelById(req, res);

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
  
};

export default connectDB(handler);
