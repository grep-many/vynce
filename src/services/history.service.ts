// src/services/history.service.ts
import axiosInstance from '@/lib/axios';

export const addToHistory = async (videoId: string) => {
  const { data } = await axiosInstance.post('/history', { videoId });
  return data;
};

export const getHistoryVideos = async (): Promise<{ videos: any[] }> => {
  const { data } = await axiosInstance.get('/history');
  return data;
};

export const deleteHistoryItem = async (videoId: string) => {
  const { data } = await axiosInstance.patch('/history', { data: { videoId } });
  return data;
};

export const clearHistory = async () => {
  const { data } = await axiosInstance.delete('/history');
  return data;
};
