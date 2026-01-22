import { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          const res = await api.get("/api/auth/me");
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } catch {
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (identifier, password) => {
    try {
      setLoading(true);
      const res = await api.post("/api/auth/login", {
        identifier,
        password,
      });

      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    try {
      setLoading(true);
      await api.post("/api/auth/register", {
        username,
        email,
        password,
      });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Signup failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, signup, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
