import fs from 'fs';
import path from 'path';
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

export const getVideo = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query; // id can be undefined or [id]
  // If id is present → stream single video
  if (id && (typeof id === 'string' || Array.isArray(id))) {
    const videoId = Array.isArray(id) ? id[0] : id;

    try {
      const video = await Video.findById(videoId).lean();
      if (!video) return res.status(404).json({ message: 'Video not found' });

      const videoPath = path.join('uploads', path.basename(video.filename));
      if (!fs.existsSync(videoPath))
        return res
          .status(404)
          .json({ message: 'Video file not found on server' });

      const stat = fs.statSync(videoPath);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (!range) {
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': video.filetype || 'video/mp4',
        });
        fs.createReadStream(videoPath).pipe(res);
        return;
      }

      const CHUNK_SIZE = 10 ** 6;
      const start = Number(range.replace(/\D/g, ''));
      const end = Math.min(start + CHUNK_SIZE, fileSize - 1);
      const contentLength = end - start + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': video.filetype || 'video/mp4',
      });

      fs.createReadStream(videoPath, { start, end }).pipe(res);
    } catch (err: any) {
      console.error('Video stream error:', err);
      res
        .status(500)
        .json({ message: 'Internal server error', error: err.message });
    }

    return;
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 1;

    let videosQuery = Video.find();

    if (req.query.channel) {
      videosQuery = videosQuery.where('channel').equals(req.query.channel);
    }

    if (req.query.search) {
      const regex = new RegExp(req.query.search as string, 'i');
      videosQuery = videosQuery.or([{ title: regex }, { description: regex }]);
    }

    videosQuery = videosQuery.sort({ createdAt: -1 }).lean();

    let videos = [];
    let total = 0;

    if (page && limit) {
      total = await Video.countDocuments(videosQuery.getFilter());
      const skip = (page - 1) * limit;
      videos = await videosQuery.skip(skip).limit(limit);
      const totalPages = Math.ceil(total / limit);

      const host = getBaseUrl(req);
      const videosWithStream = videos.map((v: any) => ({
        ...v,
        filepath: `${host}/api/video/${v._id}`,
      }));

      return res
        .status(200)
        .json({ page, limit, total, totalPages, videos: videosWithStream });
    }

    // No pagination → return all
    videos = await videosQuery;
    total = videos.length;
    const host = getBaseUrl(req);
    const videosWithStream = videos.map((v: any) => ({
      ...v,
      filepath: `${host}/api/video/${v._id}`,
    }));

    res.status(200).json({ total, videos: videosWithStream });
  } catch (err: any) {
    console.error('Fetch videos error:', err);
    res
      .status(500)
      .json({ message: 'Internal server error', error: err.message });
  }
};
