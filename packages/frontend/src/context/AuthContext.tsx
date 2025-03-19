import { User as FirebaseUser } from "firebase/auth";
import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  firebaseUser: FirebaseUser;
  isAuthenticated: boolean;
  setFirebaseUser: (userInfo: FirebaseUser) => void;
  getFlickrUserName: () => string | undefined;
  setFlickrUser: (username: string | undefined) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser>({} as FirebaseUser);
  const [flickrUserName, setFlickrUserNameState] = useState<string | undefined>(undefined);

  const isAuthenticated = !!firebaseUser && !!firebaseUser.uid;

  const getFlickrUserName = () => {
    return flickrUserName || localStorage.getItem('flickrUser') || undefined;
  }
  const setFlickrUser = (username: string | undefined) => {
    setFlickrUserNameState(username || '');
    if (username === undefined) {
      localStorage.removeItem("flickrUser");
    } else {
      localStorage.setItem("flickrUser", username);
    }
  };

  const contextObject = {
    firebaseUser,
    isAuthenticated,
    setFirebaseUser,
    getFlickrUserName,
    setFlickrUser,
  };

  return (
    <AuthContext.Provider value={contextObject}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth should be used in AuthProvider.");
  }
  return context;
};