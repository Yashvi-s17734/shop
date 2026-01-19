import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import "../styles/AuthCard.css";

export default function AuthCard({ isLogin, setIsLogin }) {
  const { login, signup, loading } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (
      !password ||
      (isLogin && !identifier) ||
      (!isLogin && (!identifier || !email))
    ) {
      toast.error("Please fill all fields");
      return;
    }
    if (isLogin) {
      const res = await login(identifier, password);

      if (res.success) {
        navigate("/home");
      } else {
        toast.error(res.message);
      }
    }
    else {
      const res = await signup(identifier, email, password);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      try {
        await api.post("/api/auth/send-otp", { email });

        toast.success("OTP sent to your email");
        navigate("/verify-otp", {
          state: { email },
        });
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to send OTP");
      }
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-tabs">
        <button
          className={`auth-tab ${isLogin ? "active" : ""}`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`auth-tab ${!isLogin ? "active" : ""}`}
          onClick={() => setIsLogin(false)}
        >
          Sign Up
        </button>
      </div>
      {isLogin && (
        <>
          <label className="auth-label">Email or Username</label>
          <input
            placeholder="Email or Username"
            className="auth-input"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <label className="auth-label">Password</label>
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="password-row">
            <span
              className="forgot-link"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </span>
          </div>

          <button
            className="auth-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Please wait..." : "Login"}
          </button>
        </>
      )}
      {!isLogin && (
        <>
          <label className="auth-label">Username</label>
          <input
            placeholder="Username"
            className="auth-input"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <label className="auth-label">Email Address</label>
          <input
            placeholder="Email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="auth-label">Password</label>
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="auth-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Please wait..." : "Create Account"}
          </button>
        </>
      )}
      <a
        href={`${import.meta.env.VITE_API_URL}/api/auth/google`}
        className="google-btn"
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
        />
        Continue with Google
      </a>

      <div className="auth-footer">
        {isLogin ? (
          <>
            Don’t have an account?{" "}
            <span className="auth-link" onClick={() => setIsLogin(false)}>
              Sign Up →
            </span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span className="auth-link" onClick={() => setIsLogin(true)}>
              Login →
            </span>
          </>
        )}
      </div>
    </div>
  );
}
