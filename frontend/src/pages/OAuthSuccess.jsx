import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // 1️⃣ Get token from URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
          navigate("/", { replace: true });
          return;
        }

        // 2️⃣ Store token
        localStorage.setItem("token", token);

        // 3️⃣ Attach token to axios (IMPORTANT)
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // 4️⃣ Fetch current user (CORRECT PATH)
        const response = await api.get("/api/auth/me");

        // 5️⃣ Update auth state
        if (response.data?.user) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        // 6️⃣ Clean URL and redirect
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
    <div className="min-h-screen flex items-center justify-center">
      <p>Signing you in...</p>
    </div>
  );
}
