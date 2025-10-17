import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import jwt from "jsonwebtoken";
import { accessSecret } from '@/controllers/user.controller';

interface AuthenticatedNextApiRequest extends NextApiRequest {
  user?: {
    _id: string;
  };
}

const authenticate =
  (handler: NextApiHandler) => async (req: AuthenticatedNextApiRequest, res: NextApiResponse) => {
    const cookies = req.headers?.cookie ? cookie.parse(req.headers.cookie) : {};
    const { token } = cookies;
    if (!token) return res.status(401).json({ message: "Invalid User!" })
    try {
      const decoded = jwt.verify(token, accessSecret) as { id: string };
      req.user = { _id: decoded.id }; // attach user ID
      return handler(req, res);
    } catch (err) {
      return res.status(401).json({
        message:"Invalid token!"
      })
    }
  };

export default authenticate;
