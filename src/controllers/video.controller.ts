import { NextApiRequest, NextApiResponse } from 'next';
import uploadFile, { UploadedFile } from '@/lib/formidable';
import Video from '@/models/video.model';
import User from '@/models/user.model';
import { getBaseUrl } from '@/lib';

// Extend NextApiRequest to include `user` from authentication middleware
interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    _id: string;
  };
}

// Helper to unwrap Formidable fields
const normalizeField = (
  field: string | string[] | undefined,
): string | undefined => (Array.isArray(field) ? field[0] : field);

export const uploadVideo = async (
  req: AuthenticatedRequest,
  res: NextApiResponse,
) => {
  try {
    // Check authentication
    if (!req.user?._id)
      return res.status(401).json({ message: 'Unauthorized' });

    // Parse the video file and fields
    const { fields, file }: { fields: any; file: UploadedFile } =
      await uploadFile(req);

    // Validate file type
    if (!file.filetype || !file.filetype.startsWith('video/')) {
      return res.status(400).json({ message: 'Only video files are allowed' });
    }

    // Fetch uploader info (e.g., channel name) from User model
    const uploader = await User.findById(req.user._id);
    if (!uploader) return res.status(404).json({ message: 'User not found' });

    const channel = uploader.channel?.name;
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    // Normalize fields to plain strings
    const title = normalizeField(fields.title) || file.filename;
    const description = normalizeField(fields.description) || '';

    // Save video info to MongoDB
    const video = new Video({
      title,
      description,
      ...file,
      // filename: file.filename,
      // filetype: file.filetype,
      // filepath: file.filepath,
      // filesize: `${file.filesize}`, // string to match schema
      channel,
      uploader: req.user._id,
    });

    await video.save();

    res.status(201).json({ message: 'Upload successful!', video });
  } catch (err: any) {
    console.error('Upload Video Error:', err);
    res.status(500).json({
      message: 'Something went wrong while uploading the video!',
      error: err.message || err,
    });
  }
};

// helper function
const parseStringQuery = (
  value: string | string[] | undefined,
): string | undefined => (Array.isArray(value) ? value[0] : value);

export const getVideo = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, page, limit, channel, search } = req.query;
    const host = getBaseUrl(req);

    // --- 1️⃣ Single video by ID ---
    if (id) {
      const videoId = parseStringQuery(id);
      const video = await Video.findById(videoId).lean();
      if (!video) return res.status(404).json({ message: 'Video not found' });

      return res.status(200).json({
        message: 'Video found',
        video: {
          ...video,
          filepath: `${host}/api/video/stream/${video._id}`, // placeholder for future streaming
          likes: v.likes.length,
          dislikes: v.dislikes.length,
        },
      });
    }

    // --- 2️⃣ List / filter videos ---
    let videosQuery = Video.find();

    if (channel)
      videosQuery = videosQuery
        .where('channel')
        .equals(parseStringQuery(channel));

    if (search) {
      const regex = new RegExp(parseStringQuery(search) || '', 'i');
      videosQuery = videosQuery.or([{ title: regex }, { description: regex }]);
    }

    videosQuery = videosQuery.sort({ createdAt: -1 }).lean();

    // Pagination
    const pageNum = parseInt(parseStringQuery(page) || '1', 10);
    const limitNum = parseInt(parseStringQuery(limit) || '10', 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Video.countDocuments(videosQuery.getFilter());
    const videos = await videosQuery.skip(skip).limit(limitNum);

    const videosWithStream = videos.map((v: any) => ({
      ...v,
      filepath: `${host}/api/video/stream/${v._id}`,
      likes: v.likes.length,
      dislikes: v.dislikes.length
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
