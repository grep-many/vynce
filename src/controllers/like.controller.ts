import { NextApiResponse } from 'next';
import { APIReq } from './user.controller';
import Video from '@/models/video.model';
import { getBaseUrl } from '@/lib';

export const toggleReaction = async (req: APIReq, res: NextApiResponse) => {
  try {
    const { videoId, like } = req.body; // like: true => like
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!videoId || typeof like !== 'boolean')
      return res
        .status(400)
        .json({ message: 'Video ID and like boolean are required' });

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const likes = video.likes;

    if (like) {
      // Toggle like
      if (likes.includes(userId)) {
        likes.pull(userId); // remove like
        await video.save();
        return res.status(200).json({
          message: 'Like removed!',
          likes: likes.length,
        });
      }
      likes.push(userId);
    }
    await video.save();
    return res.status(200).json({
      message: like ? 'Like added!' : 'Like remove!',
      likes: likes.length,
    });
  } catch (err: any) {
    console.error('Toggle reaction error:', err);
    return res
      .status(500)
      .json({ message: 'Internal server error', error: err.message });
  }
};

export const getLikedVideos = async (req: APIReq, res: NextApiResponse) => {
  if (!req.user) {
    return res.status(401).json({
      message: 'Invalid user!',
    });
  }

  try {
    const host = getBaseUrl(req);

    // Find all videos where this user has liked
    const likedVideos = await Video.find({ likes: req.user._id })
      .sort({ updatedAt: -1 })
      .populate({
        path: 'channel', // populate channel
        select: 'name image', // only select name and image
      })
      .lean();

    // If no liked videos
    if (!likedVideos || likedVideos.length === 0) {
      return res.status(200).json({
        message: 'No liked videos found.',
        videos: [],
      });
    }

    // Transform each video similar to getVideo
    const videosWithStream = likedVideos.map((video: any) => ({
      ...video,
      filepath: `${host}/api/video/stream/${video._id}`,
      likes: video.likes.length,
    }));

    return res.status(200).json({
      message: 'Fetched liked videos successfully!',
      total: videosWithStream.length,
      videos: videosWithStream,
    });
  } catch (err: any) {
    console.error('Error fetching liked videos:', err);
    return res.status(500).json({
      message: 'Internal server error!',
      error: err.message,
    });
  }
};

