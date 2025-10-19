import { NextApiRequest, NextApiResponse } from 'next';
import uploadFile, { UploadedFile } from '@/lib/formidable';
import Video from '@/models/video.model';
import User from '@/models/user.model';
import { getBaseUrl } from '@/lib';

interface AuthenticatedRequest extends NextApiRequest {
  user?: { _id: string };
}

// Helper to normalize Formidable fields
const normalizeField = (
  field: string | string[] | undefined,
): string | undefined => (Array.isArray(field) ? field[0] : field);

/**
 * 📤 Upload a new video
 */
export const uploadVideo = async (
  req: AuthenticatedRequest,
  res: NextApiResponse,
) => {
  try {
    if (!req.user?._id)
      return res.status(401).json({ message: 'Unauthorized' });

    // Parse form data + file
    const { fields, file }: { fields: any; file: UploadedFile } =
      await uploadFile(req);

    if (!file.filetype?.startsWith('video/')) {
      return res.status(400).json({ message: 'Only video files are allowed' });
    }

    // Get user's channel
    const user = await User.findById(req.user._id).populate('channel');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.channel)
      return res.status(404).json({ message: 'User has no channel' });

    // Extract fields
    const title = normalizeField(fields.title) || file.filename;
    const description = normalizeField(fields.description) || '';

    // Create new video
    const video = new Video({
      title,
      description,
      filename: file.filename,
      filetype: file.filetype,
      filepath: file.filepath,
      filesize: `${file.filesize}`,
      channel: user.channel._id,
    });

    await video.save();

    const populatedVideo = await video.populate('channel', 'name image');

    return res.status(201).json({
      message: 'Upload successful!',
      video: populatedVideo,
    });
  } catch (err: any) {
    console.error('Upload Video Error:', err);
    return res.status(500).json({
      message: 'Something went wrong while uploading the video!',
      error: err.message || err,
    });
  }
};

/**
 * 📺 Get videos (single or list)
 */
export const getVideo = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, page, limit, channel, search } = req.query;
    const host = getBaseUrl(req);

    // --- 1️⃣ Get a single video by ID ---
    if (id) {
      const videoId = Array.isArray(id) ? id[0] : id;
      const video = await Video.findById(videoId)
        .populate('channel', 'name image')
        .lean();

      if (!video) return res.status(404).json({ message: 'Video not found' });

      return res.status(200).json({
        message: 'Video found',
        video: {
          ...video,
          filepath: `${host}/api/video/stream/${video._id}`,
          likes: video.likes.length,
        },
      });
    }

    // --- 2️⃣ Get multiple videos ---
    const query: any = {};

    if (channel) {
      query.channel = Array.isArray(channel) ? channel[0] : channel;
    }

    if (search) {
      const searchValue = Array.isArray(search) ? search[0] : search;
      query.$or = [
        { title: { $regex: searchValue, $options: 'i' } },
        { description: { $regex: searchValue, $options: 'i' } },
      ];
    }
    const pageNum = parseInt(Array.isArray(page) ? page[0] : page || '1', 10);
    const limitNum = parseInt(
      Array.isArray(limit) ? limit[0] : limit || '10',
      10,
    );
    const skip = (pageNum - 1) * limitNum;

    // 3️⃣ Fetch from MongoDB directly
    const [total, videos] = await Promise.all([
      Video.countDocuments(query),
      Video.find(query)
        .populate('channel', 'name image')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    const videosWithStream = videos.map((v) => ({
      ...v,
      filepath: `${host}/api/video/stream/${v._id}`,
      likes: v.likes.length,
    }));

    return res.status(200).json({
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      videos: videosWithStream,
    });
  } catch (err: any) {
    console.error('Video controller error:', err);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
};
