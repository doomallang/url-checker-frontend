"use client";

import React from "react";

type AuthState = { token: string | null; email?: string | null };
type AuthContextType = {
  auth: AuthState;
  login: (token: string, email?: string) => void;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = React.useState<AuthState>({ token: null });

  React.useEffect(() => {
    const t = localStorage.getItem("token");
    const e = localStorage.getItem("email");
    setAuth({ token: t, email: e });
  }, []);

  const login = React.useCallback((token: string, email?: string) => {
    localStorage.setItem("token", token);
    if (email) localStorage.setItem("email", email);
    setAuth({ token, email });
  }, []);

  const logout = React.useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setAuth({ token: null, email: null });
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
