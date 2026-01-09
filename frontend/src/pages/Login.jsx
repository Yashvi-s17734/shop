import { useState } from "react";
import brassutensil from "../assets/brassutensils.png";

import Header from "../components/Header";
import AuthCard from "../components/AuthCard";
import TrustStrip from "../components/TrustStrip";
import Footer from "../components/Footer";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-full text-[#6b4f2d]">
      <Header />
      <section
        className="relative w-full bg-cover bg-right bg-no-repeat pt-16"
        style={{ backgroundImage: `url(${brassutensil})` }}
      >
        <div
          className="absolute inset-0 
          bg-gradient-to-r from-[#f7efe6]/90 via-[#f7efe6]/70 to-transparent 
          backdrop-blur-sm temple-glow"
        ></div>

        <div className="relative max-w-7xl mx-auto px-10 py-12 flex justify-center">
          <AuthCard isLogin={isLogin} setIsLogin={setIsLogin} />
        </div>
      </section>

      <TrustStrip />
      <Footer />
    </div>
  );
}
