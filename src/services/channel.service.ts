import axiosInstance from "@/lib/axios";

interface CreateOrUpdateChannelPayload {
  name: string;
  description?: string;
  image?: string;
}

export const createOrUpdateChannel = async (
  payload: CreateOrUpdateChannelPayload,
) => {
  const { data } = await axiosInstance.post('/channel', payload);
  return data;
};

export const toggleSubscription = async (channelId: string) => {
  const { data } = await axiosInstance.put("/channel", {
    channelId
  });
  return data;
};

export const getSubscribedChannels = async () => {
  const { data } = await axiosInstance.get('/channel/subscriptions');
  return data;
};

export const getChannelById = async (id: string) => {
  const { data } = await axiosInstance.get(`/channel/${id}`);
  return data;
};
