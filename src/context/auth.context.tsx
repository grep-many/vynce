import { auth, provider } from '@/lib';
import { loginUser } from '@/services/auth.service';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import React from 'react';
import { toast } from 'sonner';

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  loading: false,
});

export const AuthProvider: React.FC<ProviderProps> = ({ children }) => {
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
        setUser,
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
