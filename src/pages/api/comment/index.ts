import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/middleware/dbConnect';
import authenticate from '@/middleware/authenticate';
import {
  getComments,
  addComment,
  editComment,
  deleteComment,
} from '@/controllers/comment.controller';

// Wrap authenticated routes
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return getComments(req, res);

    case 'POST':
      return authenticate(addComment)(req, res);

    case 'PUT':
      return authenticate(editComment)(req, res);

    case 'DELETE':
      return authenticate(deleteComment)(req, res);

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default connectDB(handler);