import User from '@/models/user.model';
import { NextApiRequest, NextApiResponse } from 'next';

export const login = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email, image } = req.body;

  if (!name || !email || !image) {
    return res.status(400).json({
      message: 'Invalid request body',
    });
  }

  try {

    const user = await User.findOne({ email });
    
    if (!user) {
      const newUser = await User.create({ name, email, image });
      res.status(201).json({
        message: `Welcome! ${name.split(/\s+/)[0]}`,
        user: newUser,
      });
    } else {
      res.status(200).json({
        message: `Welcome Back! ${name.split(/\s+/)[0]}`,
        user
      })
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Something went wrong while login!',
    });
  }
};
