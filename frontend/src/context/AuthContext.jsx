import { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const login = async (identifier, password) => {
    try {
      setLoading(true);
      const res = await api.post("api/auth/login", {
        identifier,
        password,
      });
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return true;
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  const signup = async (username, email, password) => {
    try {
      setLoading(true);
      const res = await api.post("api/auth/register", {
        username,
        email,
        password,
      });
      return true;
    } catch (err) {
      console.log(err.response?.data?.message || "Signup failed");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
