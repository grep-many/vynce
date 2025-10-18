import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";

export const likeVideo = async (videoId: string, like: boolean) => {
  try {
    const res = await axiosInstance.put('/video/react', {
      videoId,
      like,
    });
    return res.data;
  } catch (err: unknown) {
    throw (
      (err as AxiosError<{ message: string }>).response?.data?.message ||
      (err instanceof Error ? err.message : String(err))
    );
  }
};

export const getLikedVideos = async () => {
  try {
    const res = await axiosInstance.get('/video/react');
    return res.data;
  } catch (err: unknown) {
    throw (
      (err as AxiosError<{ message: string }>).response?.data?.message ||
      (err instanceof Error ? err.message : String(err))
    );
  }
};