import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    // 🔹 API call will come later
    setError("We cannot find your email.");
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-card">
        <div className="forgot-icon">!</div>

        <h2 className="forgot-title">Forgot Password</h2>
        <p className="forgot-subtitle">
          Enter your email and we’ll send you a link to reset your password.
        </p>

        <input
          type="email"
          placeholder="Email address"
          className="forgot-input"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
        />

        {error && <p className="forgot-error">{error}</p>}

        <button className="forgot-btn" onClick={handleSubmit}>
          Submit
        </button>

        <button className="back-login" onClick={() => navigate("/")}>
          ← Back to Login
        </button>
      </div>
    </div>
  );
}
