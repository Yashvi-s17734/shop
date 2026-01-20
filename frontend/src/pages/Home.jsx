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

import "../styles/Home.css";

export default function Home() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* Header */}
      <Header />

      {/* Welcome bar */}
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
      <TrustStrip />
      <Categories />
      <AboutRetail />
      <Footer />

      {/* Logout Modal */}
      {showModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}
