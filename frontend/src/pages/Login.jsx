import { useState } from "react";
import brassutensil from "../assets/brassutensils.png";

import Header from "../components/Header";
import AuthCard from "../components/AuthCard";
import TrustStrip from "../components/TrustStrip";
import Footer from "../components/Footer";

import "../styles/Login.css"

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="login-page">
      <Header />

      <section
        className="login-hero"
        style={{ backgroundImage: `url(${brassutensil})` }}
      >
        <div className="login-overlay"></div>

        <div className="login-content">
          <AuthCard isLogin={isLogin} setIsLogin={setIsLogin} />
        </div>
      </section>

      <TrustStrip />
      <Footer />
    </div>
  );
}
