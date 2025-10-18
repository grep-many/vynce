import {
  addToHistory,
  clearHistory,
  deleteHistoryItem,
  getHistory,
} from '@/controllers/history.controller';
import authenticate from '@/middleware/authenticate';
import connectDB from '@/middleware/dbConnect';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return authenticate(getHistory)(req, res);
    case 'POST':
      return authenticate(addToHistory)(req, res);
    case 'PATCH':
      return authenticate(deleteHistoryItem)(req, res);
    case 'DELETE':
      return authenticate(clearHistory)(req, res);

    default:
      return res.status(405).json({
        message: 'Invalid method!',
      });
  }
};

export default connectDB(handler);
