import { login, update } from '@/controllers/user.controller';
import authenticate from '@/lib/authenticate';
import connectDB from '@/lib/dbConnect';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      return login(req, res);
    case 'PATCH':
      return authenticate(update)(req,res);

    default:
      return res.status(405).json({
        message: 'Invalid method!',
      });
  }
};

export default connectDB(handler);
