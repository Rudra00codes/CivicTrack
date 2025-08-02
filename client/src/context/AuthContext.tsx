import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        });
      } else {
        setUser(null);
      }
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(firebaseUser, { displayName });
      
      // Update the user state with the display name
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: displayName,
        photoURL: firebaseUser.photoURL
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoaded, 
      isSignedIn: !!user, 
      login, 
      register,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
