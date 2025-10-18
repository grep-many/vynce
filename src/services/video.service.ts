import axiosInstance from '@/lib/axios';
import { AxiosError } from 'axios';

export interface UploadVideoData {
  title: string;
  description: string;
  file: File;
}

interface VideoFilters {
  page?: number;
  limit?: number;
  search?: string;
  channel?: string;
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

// GET /api/video?page=1&limit=5&search=nature&channel=Nature Channel
export const getVideos = async ({
  page = 1,
  limit = 8,
  search,
  channel,
}: VideoFilters) => {
  try {
    let query = '';

    const params = new URLSearchParams();

    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (channel) params.append('channel', channel);

    query = `?${params.toString()}`;

    const res = await axiosInstance.get(`/video${query}`);
    return res.data;
  } catch (err: unknown) {
    throw (
      (err as AxiosError<{ message: string }>).response?.data?.message ||
      (err instanceof Error ? err.message : String(err))
    );
  }
};

export const getVideo = async (id:string) => {
  try {
    const res = await axiosInstance.get(`/video/${id}`)
    return res.data
  } catch (err: unknown) {
    throw (
      (err as AxiosError<{ message: string }>).response?.data?.message ||
      (err instanceof Error ? err.message : String(err))
    );
  }
};
