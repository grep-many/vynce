import { APIReq } from '@/controllers/user.controller';
import { getWatchLaterVideos, toggleWatchLater } from '@/controllers/watch.controller';
import authenticate from '@/middleware/authenticate';
import connectDB from '@/middleware/dbConnect';
import { NextApiResponse } from 'next';

const handler = async (req: APIReq, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return authenticate(getWatchLaterVideos)(req,res)
    case "PUT":
      return authenticate(toggleWatchLater)(req,res)

    default:
      return res.status(405).json({
        message: 'Invalid method!',
      });
  }
};

export default connectDB(handler);