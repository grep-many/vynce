// src/services/history.service.ts
import axios from '@/lib/axios';
import { Video } from '@/types/video';

export const addToHistory = async (videoId: string) => {
  const { data } = await axios.post('/history', { videoId });
  return data;
};

export const getHistoryVideos = async (): Promise<{ videos: Video[] }> => {
  const { data } = await axios.get('/history');
  return data;
};

export const deleteHistoryItem = async (videoId: string) => {
  const { data } = await axios.patch('/history', { data: { videoId } });
  return data;
};

export const clearHistory = async () => {
  const { data } = await axios.delete('/history');
  return data;
};
