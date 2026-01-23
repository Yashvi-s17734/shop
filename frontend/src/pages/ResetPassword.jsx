import { useState, useEffect, useRef } from "react";
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

  const blockedRef = useRef(false);

  useEffect(() => {
    if (!email) {
      navigate("/", { replace: true });
    }
  }, [email, navigate]);

  const verifyOtp = async () => {
    if (loading || blockedRef.current) return;

    if (otp.length !== 6) {
      toast.error("Enter valid OTP");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/auth/verify-reset-otp", { email, otp });

      toast.success("OTP verified");
      setOtpVerified(true);
    } catch (err) {
      const data = err.response?.data;

      if (data?.code === "OTP_RESENT") {
        toast.success("New OTP sent to your email");
        setOtp("");
        return;
      }
      if (data?.code === "BLOCKED") {
        blockedRef.current = true;
        toast.error("Too many attempts. Try again later");
        navigate("/forgot-password", { replace: true });
        return;
      }

      toast.error(data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (loading || blockedRef.current) return;

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
      const data = err.response?.data;

      if (data?.code === "BLOCKED") {
        toast.error("Too many attempts. Try again later");
        navigate("/forgot-password", { replace: true });
        return;
      }

      toast.error(data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-card">
        <h2 className="forgot-title">Reset Password</h2>

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
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
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
