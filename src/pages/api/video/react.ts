import { toggleReaction } from "@/controllers/like.controller";
import authenticate from "@/middleware/authenticate";
import connectDB from "@/middleware/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'PUT':
      return authenticate(toggleReaction)(req, res);
    default:
      return res.status(405).json({
        message: 'Invalid method!',
      });
  }
};

export default connectDB(handler);
