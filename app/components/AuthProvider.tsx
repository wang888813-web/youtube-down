"use client";

import { GoogleOAuthProvider, GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useState, useEffect, createContext, useContext } from "react";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "879083991376-7307ufmjnjhrpicos3gabkpe6v0o1fdp.apps.googleusercontent.com";

interface User {
  name: string;
  email: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  loading: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("yt_user");
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
  }, []);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const info = await res.json();
        const u: User = {
          name: info.name,
          email: info.email,
          picture: info.picture,
        };
        setUser(u);
        localStorage.setItem("yt_user", JSON.stringify(u));
      } catch (e) {
        console.error("Failed to get user info", e);
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setLoading(false);
      console.error("Login failed");
    },
  });

  const logout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem("yt_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </GoogleOAuthProvider>
  );
}
