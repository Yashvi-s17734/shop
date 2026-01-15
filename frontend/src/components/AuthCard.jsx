import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
      const ok = await login(identifier, password);
      if (ok) navigate("/home");
      else toast.error("Login failed");
    } else {
      const ok = await signup(identifier, email, password);
      if (ok) {
        toast.success("Account created! Please login.");
        setIsLogin(true);
      } else toast.error("Signup failed");
    }
  };

  return (
    <div className="auth-card">
      {/* Tabs */}
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

      {/* LOGIN */}
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

      {/* SIGNUP */}
      {!isLogin && (
        <>
          <label className="auth-label">Email or Username</label>
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
            placeholder="Password"
            type="password"
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

      {/* Google */}
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

      {/* Footer */}
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
