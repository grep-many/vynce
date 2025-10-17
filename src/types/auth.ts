import { User } from './user';

export interface ChannelData {
  title: string;
  description: string;
}

export interface LoginData {
  name: string;
  email: string;
  image: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  createChannel: (data: ChannelData) => Promise<string>;
  logIn: (data: LoginData) => void;
  logOut: () => Promise<void>;
  googleSignIn: () => Promise<void>;
}
