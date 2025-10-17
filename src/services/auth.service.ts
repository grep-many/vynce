import axiosInstance from '@/lib/axios';

export const loginUser = async (data) => {
  const res = await axiosInstance.post('/auth', data);
  return res;
};

export const updateUser = async (data) => {
  try {
    const res = await axiosInstance.patch('/auth', data);
    return res.data; // ✅ must return data
  } catch (err) {
    throw err.response?.data?.message || err.message;
  }
};
