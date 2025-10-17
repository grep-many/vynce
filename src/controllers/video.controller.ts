// src/controllers/video.controller.ts
import { NextApiRequest, NextApiResponse } from 'next';
import uploadFile, { UploadedFile } from '@/lib/formidable';
import Video from '@/models/video.model';
import User from '@/models/user.model';

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
    if (!file.mimetype || !file.mimetype.startsWith('video/')) {
      return res.status(400).json({ message: 'Only video files are allowed' });
    }

    // Fetch uploader info (e.g., channel name) from User model
    const uploader = await User.findById(req.user._id);
    if (!uploader) return res.status(404).json({ message: 'User not found' });

    const channel = uploader.channel?.name;
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    // Normalize fields to plain strings
    const title = normalizeField(fields.title) || file.originalFilename;
    const description = normalizeField(fields.description) || '';

    // Save video info to MongoDB
    const video = new Video({
      title,
      description,
      filename: file.originalFilename,
      filetype: file.mimetype,
      filepath: file.filepath,
      filesize: `${file.size}`, // string to match schema
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