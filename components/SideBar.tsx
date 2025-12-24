import { Home, Users, BarChart, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SideBar() {
  const navigate = useNavigate();

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-6 flex flex-col">
      <h2 className="text-2xl font-bold mb-8 ">Admin Panel</h2>

      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 mb-2 cursor-pointer"
      >
        <Home size={20} /> Dashboard
      </button>

      <button
        onClick={() => navigate("/user")}
        className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 mb-2 cursor-pointer"
      >
        <Users size={20} /> Users
      </button>

      <button
        onClick={() => navigate("/Products")}
        className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 mb-2 cursor-pointer"
      >
        <BarChart size={20} /> Products
      </button>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
        className="flex items-center gap-3 p-3 mt-auto rounded hover:bg-red-600 cursor-pointer"
      >
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
}
