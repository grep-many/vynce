import mongoose from 'mongoose';
import type { NextApiHandler, NextApiResponse, NextApiRequest } from 'next';

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('Please defined MONGO_URI in environment!');
}

let cached = (global as any).mongoose || { conn: null, promise: null };

const connectDB =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (cached.conn) return handler(req, res);

    if (!cached.promise) {
      cached.promise = mongoose.connect(uri);
    }

    try {
      cached.conn = await cached.promise;
      await Promise.all([
        import('@/models/user.model'),
        import('@/models/channel.model'),
        import('@/models/history.model'),
        import('@/models/comment.model'),
        import('@/models/video.model'),
      ]);
    } catch (err) {
      cached.promise = null;
      console.error('DB connection failed:', err);
      return res.status(500).json({ error: 'MongoDB connection failed!' });
    }
    (global as any).mongoose = cached;
    return handler(req, res);
  };

export default connectDB;
