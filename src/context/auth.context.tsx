import { auth, provider } from '@/lib';
import { loginUser, updateUser } from '@/services/auth.service';
import { createOrUpdateChannel } from '@/services/channel.service';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import React from 'react';
import { toast } from 'sonner';

// createOrUpdate: (payload: {
//     name: string;
//     description?: string;
//     image?: string;
//   }) => Promise<void>;

export const AuthContext = React.createContext<any>({
  user: null,
  loading: false,
  logIn: () => {},
  createOrUpdate: async () => {},
  logOut: async () => {},
  googleSignIn: async () => {},
});

export const AuthProvider: React.FC<any> = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const logIn = (data: any) => {
    setLoading(true);
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    setLoading(false);
  };

  const googleSignIn = async () => {
    try {
      // const res = await signInWithPopup(auth,provider)
      const { user } = await signInWithPopup(auth, provider);
      // const user = res.user

      const { data } = await loginUser({
        name: user.displayName,
        email: user.email,
        image: user.photoURL || '/guest.jpg',
      });
      setUser(data.user);
      toast.success(data.message);
    } catch (err) {
      console.error(err); //todo remove
      toast.error('Something went wrong while signin!');
    }
  };

  const logOut = async () => {
    setLoading(true);
    setUser(null);
    localStorage.removeItem('user');
    await signOut(auth);
  };

  const createOrUpdate = async (payload: {
    name: string;
    description?: string;
    image?: string;
  }) => {
    setLoading(true);
    try {
      const { message, user, channel } = await createOrUpdateChannel(payload);
      setUser(user);
      toast.success(message);
      return channel;
    } catch (err: any) {
      toast.error(err.message || 'Failed to create/update channel');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const storedUser =
      typeof window !== 'undefined' && localStorage.getItem('user');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing user from localStorage:', err);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const { data } = await loginUser({
            name: user.displayName,
            email: user.email,
            image: user.photoURL || '/guest.jpg',
          });
          setUser(data.user);
        } catch (err) {
          toast.error('Session timeout');
          logOut();
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        createOrUpdate,
        loading,
        logIn,
        logOut,
        googleSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
