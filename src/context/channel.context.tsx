import { updateUser } from "@/services/auth.service";
import React from "react";
import { toast } from "sonner";

export const ChannelContext = React.createContext<ChannelContextType>({
  loading: false,
})

export const ChannelProvider: React.FC<ProviderProps> = ({ children }) => {
  const [loading, setLoading] = React.useState(false);

  const createChannel = async (data: any) => {
    setLoading(true);
    try {
      const { user, message } = await updateUser(data);
      toast.success(message);
      return user;
    } catch (err) {
      toast.error(String(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChannelContext.Provider
      value={{
        loading,
        createChannel,
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};
