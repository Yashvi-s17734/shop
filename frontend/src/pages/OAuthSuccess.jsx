import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./OAuthSuccess.css";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
          navigate("/", { replace: true });
          return;
        }

        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await api.get("/api/auth/me");

        if (response.data?.user) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        window.history.replaceState({}, document.title, "/oauth-success");
        navigate("/home", { replace: true });
      } catch (error) {
        console.error("OAuth callback failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/", { replace: true });
      }
    };

    handleOAuthCallback();
  }, [navigate, setUser]);

  return (
    <div className="oauth-success">
      <div className="oauth-card">
        <div className="oauth-spinner"></div>
        <p>Signing you in...</p>
      </div>
    </div>
  );
}
