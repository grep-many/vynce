import axiosInstance from '@/lib/axios';

export const loginUser = async (data) => {
  const res = await axiosInstance.post('/auth', data);
  return res;
};
