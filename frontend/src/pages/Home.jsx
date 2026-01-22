import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Hero from "../components/Hero";
import TrustStrip from "../components/TrustStrip";
import Categories from "../components/Categories";
import AboutRetail from "../components/AboutRetail";
import Footer from "../components/Footer";
import LogoutModal from "../components/LogoutModal";
import dinnerware from "../assets/dinnerware.webp";
import serveware from "../assets/serveware.webp";
import tableware from "../assets/tableware.webp";

import "../styles/Home.css";

export default function Home() {
  console.log(dinnerware, serveware, tableware);

  const { user, logout, loading } = useAuth();
  if (!user) return null;
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      <Header />

      <div className="home-welcome-bar">
        <h2>Welcome {user?.username || "Guest"}</h2>

        <button
          onClick={() => setShowModal(true)}
          disabled={loading}
          className="home-logout-btn"
        >
          Logout
        </button>
      </div>
      <Hero />
      <div className="category-section">
        <div className="category-card">
          <div className="arch-frame">
            <img src={dinnerware} alt="Dinnerware" />
          </div>
          <h3>Dinnerware</h3>
        </div>

        <div className="category-card">
          <div className="arch-frame">
            <img src={serveware} alt="Serveware" />{" "}
          </div>
          <h3>Serveware</h3>
        </div>

        <div className="category-card">
          <div className="arch-frame">
            <img src={tableware} alt="Tableware" />{" "}
          </div>
          <h3>Tableware</h3>
        </div>
      </div>

      <TrustStrip />
      <Categories />
      <AboutRetail />
      <Footer />
      {showModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}
