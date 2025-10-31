import React from 'react';
import { toast } from 'sonner';
import {
  toggleSubscription,
  getSubscribedChannels,
  getChannelById,
} from '@/services/channel.service';

interface Channel {
  videos: any[];
  _id: string;
  name: string;
  description?: string;
  image?: string;
  subscribers?: number;
}

interface ChannelContextType {
  channel?: Channel;
  subscribedChannels: Channel[];
  setSubscribedChannels: React.Dispatch<React.SetStateAction<Channel[]>>;
  loading: boolean;
  fetchChannel: (id: string) => Promise<void>;
  subscribe: (channelId: string) => Promise<void>;
  fetchSubscribedChannels: () => Promise<void>;
  isChannelSubscribed: (id: string) => boolean;
}

export const ChannelContext = React.createContext<ChannelContextType>({
  channel: undefined,
  subscribedChannels: [],
  setSubscribedChannels: () => {},
  loading: false,
  fetchChannel: async () => {},
  subscribe: async () => {},
  fetchSubscribedChannels: async () => {},
  isChannelSubscribed: () => false,
});

export interface ProviderProps {
  children: React.ReactNode;
}

export const ChannelProvider: React.FC<ProviderProps> = ({ children }) => {
  const [channel, setChannel] = React.useState<Channel>();
  const [subscribedChannels, setSubscribedChannels] = React.useState<Channel[]>(
    [],
  );
  const [loading, setLoading] = React.useState(false);

  const fetchChannel = async (id: string) => {
    setLoading(true);

    try {
      const res = await getChannelById(id);

      setChannel(res.channel);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch channel');
    } finally {
      setLoading(false);
    }
  };

  const subscribe = async (id: string) => {
    try {
      const res = await toggleSubscription(id);
      toast.success(res.message);
      await fetchSubscribedChannels(); // refresh subscriptions
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle subscription');
    }
  };

  const fetchSubscribedChannels = async () => {
    setLoading(true);
    try {
      await getSubscribedChannels().then((res) => {
        setSubscribedChannels(res.channels);
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const isChannelSubscribed = (id: string) =>
    subscribedChannels.some((ch) => ch._id === id);

  // React.useEffect(() => {
  //   fetchSubscribedChannels();
  // }, []);

  return (
    <ChannelContext.Provider
      value={{
        channel,
        subscribedChannels,
        setSubscribedChannels,
        loading,
        fetchChannel,
        subscribe,
        fetchSubscribedChannels,
        isChannelSubscribed,
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};
