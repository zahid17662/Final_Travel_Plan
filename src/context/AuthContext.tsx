import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  handle?: string;
  bio?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginPayload) => Promise<AuthUser>;
  signup: (data: SignupPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "tp_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/auth/me", {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        const userData: AuthUser = data.user || data;
        setUser(userData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
        return;
      }

      // If backend returns 401 Unauthorized or not found
      if (res.status === 401) {
        setUser(null);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return;
      }

      // If other HTTP error, check stored session fallback
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch {
      // Backend is offline / unreachable in local dev: check cached session
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (payload: LoginPayload): Promise<AuthUser> => {
    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        const userData: AuthUser = data.user || data;
        setUser(userData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
        return userData;
      }

      // If backend endpoint is 404 (no backend server attached), fall back to local dev session
      if (res.status === 404) {
        const fallbackUser: AuthUser = {
          id: `u_${Date.now()}`,
          name: payload.email.split("@")[0].replace(/[._]/g, " "),
          email: payload.email,
          handle: `@${payload.email.split("@")[0]}`,
        };
        setUser(fallbackUser);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackUser));
        return fallbackUser;
      }

      const errData = await res.json().catch(() => null);
      throw new Error(errData?.message || `Login failed with status ${res.status}`);
    } catch (err: unknown) {
      // If backend is unreachable, provide graceful dev fallback for testing
      const isNetworkError = err instanceof TypeError && err.message.includes("fetch");
      if (isNetworkError) {
        const fallbackUser: AuthUser = {
          id: `u_${Date.now()}`,
          name: payload.email.split("@")[0].replace(/[._]/g, " "),
          email: payload.email,
          handle: `@${payload.email.split("@")[0]}`,
        };
        setUser(fallbackUser);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackUser));
        return fallbackUser;
      }
      throw err;
    }
  };

  const signup = async (payload: SignupPayload): Promise<AuthUser> => {
    try {
      const res = await fetch("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        const userData: AuthUser = data.user || data;
        setUser(userData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
        return userData;
      }

      // If backend endpoint is 404 (no backend server attached), fall back to local dev session
      if (res.status === 404) {
        const fallbackUser: AuthUser = {
          id: `u_${Date.now()}`,
          name: payload.name,
          email: payload.email,
          handle: `@${payload.name.toLowerCase().replace(/\s+/g, "")}`,
        };
        setUser(fallbackUser);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackUser));
        return fallbackUser;
      }

      const errData = await res.json().catch(() => null);
      throw new Error(errData?.message || `Signup failed with status ${res.status}`);
    } catch (err: unknown) {
      const isNetworkError = err instanceof TypeError && err.message.includes("fetch");
      if (isNetworkError) {
        const fallbackUser: AuthUser = {
          id: `u_${Date.now()}`,
          name: payload.name,
          email: payload.email,
          handle: `@${payload.name.toLowerCase().replace(/\s+/g, "")}`,
        };
        setUser(fallbackUser);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackUser));
        return fallbackUser;
      }
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch("/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const refreshUser = async (): Promise<void> => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
