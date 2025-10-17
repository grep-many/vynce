export interface ChannelContextType {
  loading: boolean;
  createChannel: (data: any) => Promise<void>;
}
