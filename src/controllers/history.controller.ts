import { NextApiResponse } from 'next';
import { APIReq } from './user.controller';
import History from '@/models/history.model';
import Video from '@/models/video.model';

// Add a video to history
export const addToHistory = async (req: APIReq, res: NextApiResponse) => {
  try {
    const { videoId } = req.body;
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!videoId) return res.status(400).json({ message: 'Video ID required' });

    const video = await Video.findById(videoId);
    
    if (!video) return res.status(404).json({ message: 'Video not found' });

    // Check if already in history, update timestamp if exists
    const existing = await History.findOne({ user: userId, video: videoId });
    if (existing) {
      existing.watchedOn = new Date();
      await existing.save();
    } else {
      await History.create({ user: userId, video: videoId });
    }

    res.status(200).json({ message: 'Added to history' });
  } catch (err: any) {
    console.error('Add to history error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user history
export const getHistory = async (req: APIReq, res: NextApiResponse) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });


    const history = await History.find({ user: userId })
      .sort({ watchedOn: -1 })
      .populate({
        path: 'video',
        populate: {
          path: 'channel',
          select: 'name image', // only fetch name and image
        },
      })
      .lean();  

    const videos = history.map((h: any) => {
      const video = h.video;
      return {
        ...video,
        watchedOn: h.watchedOn,
        filepath: h.video.filepath,
        likes: video?.likes.length,
      };
    });

    res
      .status(200)
      .json({ message: 'Fetched history', total: videos.length, videos });
  } catch (err: any) {
    console.error('Fetch history error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Optional: delete a single history item
export const deleteHistoryItem = async (req: APIReq, res: NextApiResponse) => {
  try {
    const { videoId } = req.body;
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    await History.deleteOne({ user: userId, video: videoId });
    res.status(200).json({ message: 'History item removed' });
  } catch (err: any) {
    console.error('Delete history error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Optional: clear all history
export const clearHistory = async (req: APIReq, res: NextApiResponse) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    await History.deleteMany({ user: userId });
    res.status(200).json({ message: 'History cleared' });
  } catch (err: any) {
    console.error('Clear history error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
