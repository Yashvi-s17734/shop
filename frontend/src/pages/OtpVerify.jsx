import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import "../styles/OtpVerify.css";

const OTP_TIME = 300;

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(OTP_TIME);
  const [verifying, setVerifying] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const email = location.state?.email;
  useEffect(() => {
    setUser(null);
    localStorage.clear();
    delete api.defaults.headers.common["Authorization"];
  }, [setUser]);
  useEffect(() => {
    if (!email) navigate("/", { replace: true });
  }, [email, navigate]);
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);
  useEffect(() => {
    if (otp.length === 6 && !verifying) {
      handleVerify();
    }
  }, [otp]);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleVerify = async () => {
    if (verifying) return;
    setVerifying(true);

    try {
      const res = await api.post("/api/auth/verify-otp", { email, otp });

      const token = res.data.token;
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const meRes = await api.get("/api/auth/me");
      setUser(meRes.data.user);
      localStorage.setItem("user", JSON.stringify(meRes.data.user));

      toast.success("Email verified successfully");
      navigate("/home", { replace: true });
    } catch (err) {
      const data = err.response?.data;

      if (data?.code === "BLOCKED") {
        toast.error("Too many attempts. Try again after 20 minutes");
        navigate("/forgot-password", { replace: true });
        return;
      }

      toast.error(data?.message || "Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };

  const resendOtp = async () => {
    try {
      await api.post("/api/auth/send-otp", { email });

      toast.success("OTP resent");
      setOtp("");
      setTimeLeft(OTP_TIME);
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <h2 className="otp-title">Verify Email</h2>

        <p className="otp-subtitle">
          OTP sent to <br />
          <span>{email}</span>
        </p>

        <input
          className="otp-input"
          placeholder="••••••"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          maxLength={6}
        />

        <div className="otp-timer">
          {timeLeft > 0 ? (
            <>
              OTP expires in <b>{formatTime(timeLeft)}</b>
            </>
          ) : (
            <span className="expired">OTP expired</span>
          )}
        </div>

        <button
          className="otp-btn"
          onClick={handleVerify}
          disabled={otp.length !== 6 || verifying}
        >
          {verifying ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          className="otp-resend"
          onClick={resendOtp}
          disabled={timeLeft > 0}
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
}
