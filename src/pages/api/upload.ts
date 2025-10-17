import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // must disable default parser
    sizeLimit: '30mb',
  },
};

// Extend the parsed files type
interface ParsedFiles {
  video?: File;
  [key: string]: File | undefined;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const uploadDir = path.join(process.cwd(), '/public/uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
    maxFileSize: 30 * 1024 * 1024, // 50 MB
  });

  form.parse(req, (err: { message: any; }, fields: any, files: ParsedFiles) => {
    if (err) return res.status(500).json({ error: err.message });

    // Example: files.video
    const videoFile = files.video;
    if (!videoFile) return res.status(400).json({ error: 'No file uploaded' });

    const fileUrl = `/uploads/${path.basename(videoFile.filepath)}`;
    res.status(200).json({
      fields,
      file: {
        name: videoFile.originalFilename,
        size: videoFile.size,
        type: videoFile.mimetype,
        url: fileUrl,
      },
    });
  });
}
