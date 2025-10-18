import { NextApiResponse } from 'next';
import { APIReq } from './user.controller';
import Video from '@/models/video.model';
import { getBaseUrl } from '@/lib';

/**
 * Toggle Watch Later
 */
export const toggleWatchLater = async (req: APIReq, res: NextApiResponse) => {
  try {
    const { videoId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!videoId) {
      return res.status(400).json({ message: 'Video ID is required' });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const list = video.watchLater;

    // Toggle logic
    if (list.includes(userId)) {
      list.pull(userId);
      await video.save();
      return res.status(200).json({
        message: 'Removed from Watch Later',
        watchLaterCount: list.length,
      });
    }

    list.push(userId);
    await video.save();

    return res.status(200).json({
      message: 'Added to Watch Later',
      watchLaterCount: list.length,
    });
  } catch (err: any) {
    console.error('Toggle Watch Later error:', err);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
};

/**
 * Get Watch Later Videos
 */
export const getWatchLaterVideos = async (
  req: APIReq,
  res: NextApiResponse,
) => {
  if (!req.user) {
    return res.status(401).json({
      message: 'Invalid user!',
    });
  }

  try {
    const host = getBaseUrl(req);

    // Find videos where user added to watch later
    const watchLaterVideos = await Video.find({ watchLater: req.user._id })
      .sort({ updatedAt: -1 })
      .lean();

    if (!watchLaterVideos || watchLaterVideos.length === 0) {
      return res.status(200).json({
        message: 'No watch later videos found.',
        videos: [],
      });
    }

    // Format videos like in getVideo()
    const videosWithStream = watchLaterVideos.map((video: any) => ({
      ...video,
      filepath: `${host}/api/video/stream/${video._id}`,
      likes: video.likes.length,
      dislikes: video.dislikes.length,
      watchLater: video.watchLater.length,
    }));

    return res.status(200).json({
      message: 'Fetched Watch Later videos successfully!',
      total: videosWithStream.length,
      videos: videosWithStream,
    });
  } catch (err: any) {
    console.error('Error fetching Watch Later videos:', err);
    return res.status(500).json({
      message: 'Internal server error!',
      error: err.message,
    });
  }
};
