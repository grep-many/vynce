import axiosInstance from '@/lib/axios';
import { AxiosError } from 'axios';

export interface UploadVideoData {
  title: string;
  description: string;
  file: File;
}

export const uploadVideo = async (
  data: UploadVideoData,
  onUploadProgress?: (percent: number) => void,
) => {
  try {
    const formData = new FormData();
    formData.append('video', data.file); // key MUST match server: files.video
    formData.append('title', data.title);
    formData.append('description', data.description);

    const res = await axiosInstance.post('/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1),
          );
          onUploadProgress(percentCompleted);
        }
      },
    });

    return res.data;
  } catch (err: unknown) {
    throw (
      (err as AxiosError<{ message: string }>).response?.data?.message ||
      (err instanceof Error ? err.message : String(err))
    );
  }
};
