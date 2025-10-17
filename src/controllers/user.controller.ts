import User from '@/models/user.model';
import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export const accessSecret = process.env.ACCESS_TOKEN_SECRET || 'secret';

export const login = async (req: NextApiRequest, res: NextApiResponse) => {
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

export const update = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found!',
      });
    }

    user.channel = { name, description };
    await user.save();

    return res.status(201).json({
      message: 'Channel created successfully!',
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Something went wrong while creating channel!',
    });
  }
};
