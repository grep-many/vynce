import User from '@/models/user.model';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export const accessSecret = process.env.ACCESS_TOKEN_SECRET || 'secret';

interface APIReq extends NextApiRequest {
  user?: {
    _id: string;
  };
}

export const login = async (req: APIReq, res: NextApiResponse) => {
  const { name, email, image } = req.body;

  if (!name || !email || !image) {
    return res.status(400).json({
      message: 'Invalid request body',
    });
  }

  try {
    let newbie = false;
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ name, email, image });
      newbie = true;
    }

    const token = jwt.sign({ id: user._id }, accessSecret, {
      expiresIn: '7d',
    });

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      }),
    );

    user = await User.findById(user._id).populate('channel');
    return res.status(newbie ? 201 : 200).json({
      message: `Welcome ${newbie ? '' : 'Back'}! ${name.split(/\s+/)[0]}`,
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Something went wrong while login!',
    });
  }
};
