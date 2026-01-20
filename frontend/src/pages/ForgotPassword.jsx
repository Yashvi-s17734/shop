import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import "../styles/ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/auth/forgot-password", { email });

      toast.success("OTP sent to your email");
      navigate("/reset-password", {
        state: { email },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "We cannot find your email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-card">
        <div className="forgot-icon">!</div>

        <h2 className="forgot-title">Forgot Password</h2>
        <p className="forgot-subtitle">
          Enter your email and we’ll send you an OTP to reset your password.
        </p>

        <input
          type="email"
          placeholder="Email address"
          className="forgot-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="forgot-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Sending..." : "Submit"}
        </button>

        <button className="back-login" onClick={() => navigate("/")}>
          ← Back to Login
        </button>
      </div>
    </div>
  );
}
