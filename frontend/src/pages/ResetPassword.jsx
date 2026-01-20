import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import "../styles/AuthCard.css";

export default function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email;
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  if (!email) navigate("/", { replace: true });

  const resetPassword = async () => {
    if (!otp || !password) return toast.error("All fields required");

    try {
      await api.post("/api/auth/reset-password", {
        email,
        otp,
        password,
      });

      toast.success("Password reset successful");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Reset Password</h2>

      <input
        placeholder="Enter OTP"
        className="auth-input"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <input
        type="password"
        placeholder="New Password"
        className="auth-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="auth-btn" onClick={resetPassword}>
        Reset Password
      </button>
    </div>
  );
}
