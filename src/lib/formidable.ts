import formidable, { File, Fields, Files } from 'formidable';
import type { NextApiRequest } from 'next';

export interface UploadedFile {
  originalFilename: string;
  filepath: string;
  mimetype: string;
  size: number;
}

interface VideoFields {
  title?: string;
  description?: string;
  [key: string]: any;
}

const uploadFile = async (
  req: NextApiRequest,
): Promise<{ fields: VideoFields; file: UploadedFile }> => {

  const form = formidable({
    multiples: false,
    uploadDir:"uploads",
    keepExtensions: true,
    filename: (originalName: string) => {
      // Use originalName provided by formidable
      return `${new Date().toISOString().replace(/:/g, '-')}-${originalName}.mp4`;
    },
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err: any, fields?: Fields, files?: Files) => {
      if (err) return reject(err);

      const parsedFields: VideoFields = (fields || {}) as VideoFields;

      if (!files) return reject(new Error('No file uploaded'));

      const fileField = files.video;
      if (!fileField) return reject(new Error('No file uploaded'));

      const file: File = Array.isArray(fileField) ? fileField[0] : fileField;

      if (!file.mimetype || file.mimetype !== 'video/mp4')
        return reject(new Error('Only .mp4 files allowed'));

      const uploadedFile: UploadedFile = {
        originalFilename: file.originalFilename || '',
        filepath: file.filepath,
        mimetype: file.mimetype,
        size: file.size,
      };

      resolve({ fields: parsedFields, file: uploadedFile });
    });
  });
};

export default uploadFile;
