import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  if (!email) {
    navigate("/", { replace: true });
    return null;
  }

  const handleVerify = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      const res = await api.post("/api/auth/verify-otp", {
        email,
        otp,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Email verified successfully");
      navigate("/home", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  const resendOtp = async () => {
    try {
      await api.post("/api/auth/send-otp", { email });
      toast.success("OTP resent");
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="otp-page">
      <h2>Verify OTP</h2>
      <p>
        OTP sent to <b>{email}</b>
      </p>

      <input
        type="text"
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={handleVerify}>Verify</button>

      <button onClick={resendOtp} className="link-btn">
        Resend OTP
      </button>
    </div>
  );
}
