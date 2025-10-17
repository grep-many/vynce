import axiosInstance from '@/lib/axios';
import { AxiosError } from 'axios';

export const loginUser = async (data: LoginData) => {
  const res = await axiosInstance.post('/auth', data);
  return res;
};

export const updateUser = async (data: ChannelData) => {
  try {
    const res = await axiosInstance.patch('/auth', data);
    return res.data;
  } catch (err: unknown) {
    throw (
      (err as AxiosError<{ message: string }>).response?.data?.message ||
      (err instanceof Error ? err.message : String(err))
    );
  }
};
