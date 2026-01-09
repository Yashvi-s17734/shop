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
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", {
        username: email,
        password,
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);

      return true;
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const signup = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/register", {
        username: email,
        password,
      });
      return true;
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
