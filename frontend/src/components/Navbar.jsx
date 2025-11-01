import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "../store/useAuthStore.js";

function Navbar() {
  const { logout, token, username } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleNavigation = (path) => {
    if (!token) navigate("/signup");
    else navigate(path);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/profile/${searchQuery.trim()}`);
      setSearchQuery("");
    }
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: "Game", path: "/game" }, // 🕹 Main game link — comes first
    { name: "Home", path: "/" },
    { name: "Blogs", path: "/blogs" },
    { name: "Diary", path: "/diary" },
    { name: "Create", path: "/create" },
    { name: "Leaderboard", path: "/leaderboard" },
  ];

  return (
    <nav className="bg-[#1E2328] text-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Left Section - Navigation Links */}
      <div className="flex gap-6 flex-wrap">
        {navItems.map((item) => (
          <button
            key={item.name}
            className={`relative hover:text-[#00b020] transition ${
              isActive(item.path)
                ? "after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-[#00b020]"
                : ""
            }`}
            onClick={() => handleNavigation(item.path)}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Center Section - Search Bar */}
      <form onSubmit={handleSearch} className="flex items-center">
        <input
          type="text"
          placeholder="Search profile..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-[#2A2F35] text-gray-100 px-3 py-1 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#00b020] w-40 sm:w-56"
        />
        <button
          type="submit"
          className="bg-[#00b020] text-black px-3 py-1 rounded-r-md hover:bg-[#00d030] transition"
        >
          Go
        </button>
      </form>

      {/* Right Section - Profile / Auth */}
      <div className="flex gap-6 items-center">
        {token ? (
          <>
            <button
              className={`relative hover:text-[#00b020] transition ${
                isActive(`/profile/${username}`)
                  ? "after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-[#00b020]"
                  : ""
              }`}
              onClick={() => handleNavigation(`/profile/${username}`)}
            >
              Profile
            </button>
            <button
              className="hover:text-red-500 transition"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className={`relative hover:text-[#00b020] transition ${
              isActive("/signup")
                ? "after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-[#00b020]"
                : ""
            }`}
            onClick={() => handleNavigation("/signup")}
          >
            Signup
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
