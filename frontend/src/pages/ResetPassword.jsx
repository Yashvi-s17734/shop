import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import "../styles/ForgotPassword.css";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ SAFE REDIRECT
  useEffect(() => {
    if (!email) {
      navigate("/", { replace: true });
    }
  }, [email, navigate]);

  // STEP 1️⃣ VERIFY OTP
  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/auth/verify-reset-otp", {
        email,
        otp,
      });

      toast.success("OTP verified");
      setOtpVerified(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2️⃣ RESET PASSWORD
  const resetPassword = async () => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/auth/reset-password", {
        email,
        password,
      });

      toast.success("Password reset successfully");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-card">
        <h2 className="forgot-title">Reset Password</h2>

        {/* OTP STEP */}
        {!otpVerified && (
          <>
            <p className="forgot-subtitle">
              Enter OTP sent to <b>{email}</b>
            </p>

            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              className="forgot-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />

            <button
              className="forgot-btn"
              onClick={verifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* PASSWORD STEP */}
        {otpVerified && (
          <>
            <p className="forgot-subtitle">Set your new password</p>

            <input
              type="password"
              placeholder="New Password"
              className="forgot-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="forgot-btn"
              onClick={resetPassword}
              disabled={loading}
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </>
        )}

        <button className="back-login" onClick={() => navigate("/")}>
          ← Back to Login
        </button>
      </div>
    </div>
  );
}
