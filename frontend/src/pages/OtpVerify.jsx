import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const email = location.state?.email;

  // 🔒 Clear any previous auth session (VERY IMPORTANT)
  useEffect(() => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }, [setUser]);

  // ❌ If someone opens this page directly
  useEffect(() => {
    if (!email) {
      navigate("/", { replace: true });
    }
  }, [email, navigate]);

  const handleVerify = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      // 1️⃣ Verify OTP
      const res = await api.post("/api/auth/verify-otp", {
        email,
        otp,
      });

      const token = res.data.token;

      // 2️⃣ Store token + attach to axios
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 3️⃣ Fetch correct logged-in user
      const meRes = await api.get("/api/auth/me");

      // 4️⃣ Update auth state
      setUser(meRes.data.user);
      localStorage.setItem("user", JSON.stringify(meRes.data.user));

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
        maxLength={6}
      />

      <button onClick={handleVerify}>Verify</button>

      <button onClick={resendOtp} className="link-btn">
        Resend OTP
      </button>
    </div>
  );
}
