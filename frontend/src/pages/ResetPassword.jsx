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
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [showResend, setShowResend] = useState(false); // New: Show resend button
  const [resendCooldown, setResendCooldown] = useState(0); // New: Countdown in seconds

  const blockedRef = useRef(false);

  useEffect(() => {
    if (!email) {
      navigate("/", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const verifyOtp = async () => {
    if (loading || blockedRef.current) return;

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/auth/verify-reset-otp", { email, otp });
      toast.success("OTP verified successfully!");
      setOtpVerified(true);
      setAttemptsLeft(3);
      setShowResend(false);
    } catch (err) {
      const data = err.response?.data || {};

      if (data.code === "BLOCKED") {
        blockedRef.current = true;
        toast.error(
          "Too many failed attempts. You are blocked for 20 minutes.",
        );
        setTimeout(() => navigate("/forgot-password", { replace: true }), 2000);
        return;
      }

      if (data.code === "INVALID_OTP") {
        const left = data.attemptsLeft ?? attemptsLeft - 1;
        setAttemptsLeft(left);
        toast.error(
          data.message ||
            `Invalid OTP. ${left} attempt${left === 1 ? "" : "s"} left`,
        );

        if (left <= 0) {
          setShowResend(true); // Show resend button when 0 attempts left
        }
        return;
      }

      if (data.message?.toLowerCase().includes("expired")) {
        toast.error("OTP has expired. Please resend a new one.");
        setShowResend(true);
        return;
      }

      toast.error(data.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (loading || resendCooldown > 0) return;

    try {
      setLoading(true);
      await api.post("/api/auth/forgot-password", { email }); // Reuse forgotPassword endpoint for resend
      toast.success("New OTP sent to your email. Please check your inbox.");
      setOtp("");
      setAttemptsLeft(3); // Reset attempts for new OTP
      setShowResend(false); // Hide button after resend
      setResendCooldown(30); // Start 30s cooldown
    } catch (err) {
      const data = err.response?.data || {};
      if (data.code === "BLOCKED") {
        blockedRef.current = true;
        toast.error("Too many attempts. You are blocked for 20 minutes.");
        setTimeout(() => navigate("/forgot-password", { replace: true }), 2000);
        return;
      }
      toast.error(
        data.message || "Failed to resend OTP. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    // (Unchanged from previous version)
    if (loading || blockedRef.current) return;

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/auth/reset-password", { email, password });
      toast.success("Password reset successfully!");
      navigate("/login", { replace: true });
    } catch (err) {
      const data = err.response?.data || {};
      if (data.code === "BLOCKED") {
        blockedRef.current = true;
        toast.error("Too many attempts. You are blocked for 20 minutes.");
        setTimeout(() => navigate("/forgot-password", { replace: true }), 2000);
        return;
      }
      toast.error(
        data.message || "Failed to reset password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-card">
        <h2 className="forgot-title">Reset Password</h2>

        {!otpVerified ? (
          <>
            <p className="forgot-subtitle">
              Enter the OTP sent to <b>{email}</b>
            </p>

            {attemptsLeft < 3 && (
              <p
                className="attempts-info"
                style={{
                  color: attemptsLeft <= 1 ? "#ff4d4f" : "#fa8c16",
                  fontWeight: "500",
                  marginBottom: "1rem",
                }}
              >
                {attemptsLeft} attempt{attemptsLeft === 1 ? "" : "s"} left
              </p>
            )}

            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              className="forgot-input"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              maxLength={6}
              disabled={loading}
            />

            <button
              className="forgot-btn"
              onClick={verifyOtp}
              disabled={loading || blockedRef.current}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {showResend && (
              <button
                className="resend-btn"
                onClick={resendOtp}
                disabled={loading || resendCooldown > 0}
                style={{
                  marginTop: "1rem",
                  opacity: resendCooldown > 0 ? 0.6 : 1,
                }}
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend OTP"}
              </button>
            )}
          </>
        ) : (
          <>
            <p className="forgot-subtitle">Set your new password</p>

            <input
              type="password"
              placeholder="New Password (min 6 characters)"
              className="forgot-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <button
              className="forgot-btn"
              onClick={resetPassword}
              disabled={loading || blockedRef.current}
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </>
        )}

        <button
          className="back-login"
          onClick={() => navigate("/login")}
          style={{ marginTop: "1.5rem" }}
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}
