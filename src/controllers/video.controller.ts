import { NextApiRequest, NextApiResponse } from 'next';
import { put } from '@vercel/blob';
import fs from 'fs';
import User from '@/models/user.model';
import Video from '@/models/video.model';
import { parseForm } from '@/lib/formidable';

interface AuthenticatedRequest extends NextApiRequest {
  user?: { _id: string };
}

/**
 * 📤 Upload a new video (Vercel Blob)
 */
export const uploadVideo = async (
  req: AuthenticatedRequest,
  res: NextApiResponse,
) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { fields, files } = await parseForm(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file || !file.mimetype?.startsWith('video/')) {
      return res.status(400).json({ message: 'Only video files are allowed' });
    }

    if (!fs.existsSync(file.filepath)) {
      return res
        .status(400)
        .json({ message: 'Uploaded file not found on server' });
    }

    // ✅ Upload to Vercel Blob
    const fileStream = fs.createReadStream(file.filepath);
    const blob = await put(file.originalFilename || 'video.mp4', fileStream, {
      access: 'public',
    });

    // ✅ Fetch user and channel
    const user = await User.findById(req.user._id).populate('channel');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.channel)
      return res.status(404).json({ message: 'User has no channel' });

    // ✅ Save metadata to MongoDB
    const video = new Video({
      title: fields.title?.[0] || file.originalFilename,
      description: fields.description?.[0] || '',
      filename: file.originalFilename,
      filetype: file.mimetype,
      filepath: blob.url,
      filesize: file.size,
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

    // --- 1️⃣ Get a single video ---
    if (id) {
      const videoId = Array.isArray(id) ? id[0] : id;
      const video: any = await Video.findById(videoId)
        .populate('channel', 'name image')
        .lean();

      if (!video) return res.status(404).json({ message: 'Video not found' });

      return res.status(200).json({
        message: 'Video found',
        video: { ...video, likes: video.likes.length },
      });
    }

    // --- 2️⃣ Filtering ---
    const query: Record<string, any> = {};

    if (channel) query.channel = Array.isArray(channel) ? channel[0] : channel;

    if (search) {
      const searchValue = Array.isArray(search) ? search[0] : search.trim();
      if (searchValue) {
        query.$or = [
          { title: { $regex: searchValue, $options: 'i' } },
          { description: { $regex: searchValue, $options: 'i' } },
        ];
      }
    }

    // --- 3️⃣ Pagination ---
    const pageNum = parseInt(Array.isArray(page) ? page[0] : page || '1', 10);
    const limitNum = parseInt(
      Array.isArray(limit) ? limit[0] : limit || '10',
      10,
    );
    const skip = (pageNum - 1) * limitNum;

    // --- 4️⃣ Query DB ---
    const [total, videos] = await Promise.all([
      Video.countDocuments(query),
      Video.find(query)
        .populate('channel', 'name image')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    const videosWithBlob = videos.map((v) => ({
      ...v,
      likes: v.likes.length,
    }));

    return res.status(200).json({
      message: 'Videos fetched successfully',
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      videos: videosWithBlob,
    });
  } catch (err: any) {
    console.error('Video controller error:', err);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
};
