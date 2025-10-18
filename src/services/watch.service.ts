import axiosInstance from '@/lib/axios';
import { AxiosError } from 'axios';

export const toggleWatchLater = async (videoId: string) => {
  try {
    const res = await axiosInstance.put('/video/watch', {
      videoId,
    });
    return res.data;
  } catch (err: unknown) {
    throw (
      (err as AxiosError<{ message: string }>).response?.data?.message ||
      (err instanceof Error ? err.message : String(err))
    );
  }
};

export const getWatchLaterVideos = async () => {
  try {
    const res = await axiosInstance.get('/video/watch');
    return res.data;
  } catch (err: unknown) {
    throw (
      (err as AxiosError<{ message: string }>).response?.data?.message ||
      (err instanceof Error ? err.message : String(err))
    );
  }
};
