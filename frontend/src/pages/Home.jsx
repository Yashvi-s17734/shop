import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  console.log(user);

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-6">
      <h1 className="text-5xl text-[#b38b59] font-bold">
        Welcome {user?.username}
      </h1>

      <button
        onClick={handleLogout}
        disabled={loading}
        className="bg-[#b38b59] text-white px-6 py-2 rounded hover:bg-[#b38b59] disabled:opacity-50"
      >
        Logout
      </button>
    </div>
  );
}
