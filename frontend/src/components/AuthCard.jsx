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
      if (ok) setIsLogin(true);
      else toast.error("Signup failed");
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

      <label className="auth-label">
        {isLogin ? "Email or Username" : "Username"}
      </label>
      <input
        className="auth-input"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        placeholder={isLogin ? "Email or Username" : "Username"}
      />

      {!isLogin && (
        <>
          <label className="auth-label">Email Address</label>
          <input
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </>
      )}

      <label className="auth-label">Password</label>
      <input
        type="password"
        className="auth-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
      </button>

      <a
        href={`${import.meta.env.VITE_API_URL}/api/auth/google`}
        className="google-btn"
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          width="20"
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
