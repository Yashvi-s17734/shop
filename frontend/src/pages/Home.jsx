import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="home">
      <h1 className="home-title">Welcome {user?.username}</h1>

      <button
        onClick={handleLogout}
        disabled={loading}
        className="home-logout-btn"
      >
        Logout
      </button>
    </div>
  );
}
