import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // make sure this is correctly imported

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // 1. Get token from URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
          console.warn("No token found in URL");
          navigate("/", { replace: true });
          return;
        }

        // 2. Store token
        localStorage.setItem("token", token);

        // 3. Fetch current user
        const response = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 4. Store user data
        if (response.data?.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        // 5. Clean URL and redirect to home
        // Remove token from URL for security
        window.history.replaceState({}, document.title, "/oauth-success");

        navigate("/home", { replace: true });
      } catch (error) {
        console.error("OAuth callback failed:", error);

        // Optional: show better error message
        if (error.response?.status === 401) {
          console.warn("Invalid or expired token");
        }

        // Clean up and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/home", { replace: true });
      }
    };

    handleOAuthCallback();

    // Optional: prevent memory leak (though not usually needed in this case)
    return () => {
      // cleanup if needed
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">
          Signing you in...
        </h2>
        <p className="mt-2 text-gray-500">Please wait a moment</p>
      </div>
    </div>
  );
}
