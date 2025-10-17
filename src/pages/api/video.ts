import { uploadVideo } from '@/controllers/video.controller';
import authenticate from '@/middleware/authenticate';
import connectDB from '@/middleware/dbConnect';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      return authenticate(uploadVideo)(req, res);
    default:
      return res.status(405).json({
        message: 'Invalid method!',
      });
  }
};

export default connectDB(handler);
