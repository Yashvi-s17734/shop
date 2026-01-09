import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast"; // 1. Import toast

export default function AuthCard({ isLogin, setIsLogin }) {
  const { login, signup, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Helper to keep styling consistent with your theme
  const themeToast = (message, type = "error") => {
    toast[type](message, {
      style: {
        border: "1px solid #d8c6b2",
        padding: "16px",
        color: "#5c442a",
        background: "#fffaf3", // Matches your card bg
      },
      iconTheme: {
        primary: "#b38b59", // Matches your button color
        secondary: "#fffaf3",
      },
    });
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      themeToast("Please fill all fields"); // Replacement for alert
      return;
    }

    if (isLogin) {
      const ok = await login(email, password);
      if (ok) {
        toast.success("Welcome back!", { style: { background: "#fffaf3" } });
        navigate("/home");
      } else {
        themeToast("Login failed. Check your credentials.");
      }
    } else {
      const ok = await signup(email, password);
      if (ok) {
        toast.success("Account created! Please login.", {
          style: { background: "#fffaf3" },
        });
        setIsLogin(true);
      } else {
        themeToast("Signup failed. Try again.");
      }
    }
  };

  return (
    <div className="w-full max-w-xl bg-[#fffaf3] rounded-2xl float-card p-10">
      {/* Add Toaster here or in your App.js root */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* ... rest of your existing JSX ... */}
      <div className="flex mb-8 bg-[#ead9c4] rounded-lg overflow-hidden">
        <button
          className={`w-1/2 py-3 font-medium ${
            isLogin ? "bg-[#b38b59] text-white" : ""
          }`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`w-1/2 py-3 font-medium ${
            !isLogin ? "bg-[#b38b59] text-white" : ""
          }`}
          onClick={() => setIsLogin(false)}
        >
          Sign Up
        </button>
      </div>
      {/* ... rest of your inputs ... */}
      <label className="block font-medium mb-2">Email Address</label>
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full h-12 px-4 mb-6 rounded-lg border border-[#d8c6b2]
        focus:outline-none focus:ring-2 focus:ring-[#b38b59]/50"
      />

      <label className="block font-medium mb-2">Password</label>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full h-12 px-4 rounded-lg border border-[#d8c6b2]
        focus:outline-none focus:ring-2 focus:ring-[#b38b59]/50"
      />

      {isLogin && (
        <div className="mt-1 text-right">
          <span className="text-xs text-[#b38b59] cursor-pointer hover:underline">
            Forgot password?
          </span>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="
          w-full h-12 mt-6
          bg-[#b38b59] text-white rounded-lg font-semibold
          shadow-md transition-all duration-150
          active:scale-[0.97]
          active:bg-[#9c7444]
          active:shadow-inner
        "
      >
        {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
      </button>

      <p className="text-center mt-6 text-lg">
        {isLogin ? (
          <>
            Don’t have an account?{" "}
            <span
              className="text-[#b38b59] cursor-pointer"
              onClick={() => setIsLogin(false)}
            >
              Sign Up →
            </span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span
              className="text-[#b38b59] cursor-pointer"
              onClick={() => setIsLogin(true)}
            >
              Login →
            </span>
          </>
        )}
      </p>
    </div>
  );
}
