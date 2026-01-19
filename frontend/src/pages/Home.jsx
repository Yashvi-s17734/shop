import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import LogoutModal from "../components/LogoutModal";
import { useState } from "react";

export default function Home() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="home">
      <h1 className="home-title">Welcome {user?.username}</h1>

      <button
        onClick={() => setShowModal(true)}
        disabled={loading}
        className="home-logout-btn"
      >
        Logout
      </button>
      {showModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
