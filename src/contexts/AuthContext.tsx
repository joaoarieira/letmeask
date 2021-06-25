import { createContext, ReactNode, useEffect, useState } from "react";
import firebase, { auth } from "../services/firebase";

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderType = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderType) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(userState => {
      if (!userState) return;

      const { displayName, photoURL, uid } = userState;

      if (!photoURL || !displayName) {
        throw new Error('Missing $photoURL or $displayName from Google');
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      });
    });

    return (() => {
      unsubscribe();
    });

  }, []);

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);

    if (!result.user) return;

    const { displayName, photoURL, uid } = result.user;

    if (!photoURL || !displayName) {
      throw new Error('Missing $photoURL or $displayName from Google');
    }

    setUser({
      id: uid,
      name: displayName,
      avatar: photoURL
    });

  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  );
}