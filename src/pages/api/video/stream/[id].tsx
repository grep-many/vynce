import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import Video from '@/models/video.model';
import connectDB from '@/middleware/dbConnect';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    const videoId = Array.isArray(id) ? id[0] : id;

    if (!videoId) {
      return res.status(400).json({ message: 'Video ID is required' });
    }

    // Fetch video metadata
    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const videoPath = path.join('uploads', path.basename(video.filename));

    if (!fs.existsSync(videoPath)) {
      // File missing → delete video from DB
      const video = await Video.findByIdAndDelete(videoId);
      return res
        .status(404)
        .json({
          message: 'Video file not found!',
          video
        });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
      // No range → send entire video
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': video.filetype || 'video/mp4',
      });
      fs.createReadStream(videoPath).pipe(res);
      return;
    }

    // Parse Range header for partial content
    const CHUNK_SIZE = 10 ** 6; // 1MB chunk
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, fileSize - 1);
    const contentLength = end - start + 1;

    // Increment views
    video.views += 1;
    await video.save();

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
};

export default connectDB(handler);