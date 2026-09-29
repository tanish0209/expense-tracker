import React, { useContext, useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import userimage from "../../assets/userimage.png";
import dropdown_icon from "../../assets/dropdown_icon.png";
import { useNavigate, NavLink } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const { token, user, clearUser } = useContext(AppContext);
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    if (clearUser) clearUser();
    localStorage.removeItem("token");
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <nav className="sticky top-3 mx-auto w-fit px-6 py-2 bg-neutral-800/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between gap-6 md:gap-12 z-50 shadow-xl transition-all">
      {/* Brand Logo */}
      <button
        className="text-white text-sm md:text-base font-extrabold tracking-wider shadow-md cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => navigate(token ? "/dashboard" : "/landing")}
      >
        EAZYTRACK
      </button>

      {/* Desktop Navigation */}
      {token && user && (
        <ul className="hidden lg:flex items-center gap-1.5 text-xs md:text-sm font-semibold">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-3 py-1 md:py-1.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600/30 text-indigo-400 font-bold border border-indigo-500/30 shadow-sm"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/income"
            className={({ isActive }) =>
              `px-3 py-1 md:py-1.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-emerald-600/30 text-emerald-400 font-bold border border-emerald-500/30 shadow-sm"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`
            }
          >
            Income
          </NavLink>

          <NavLink
            to="/expense"
            className={({ isActive }) =>
              `px-3 py-1 md:py-1.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-rose-600/30 text-rose-400 font-bold border border-rose-500/30 shadow-sm"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`
            }
          >
            Expenses
          </NavLink>
        </ul>
      )}

      {/* Profile & Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        {token && user ? (
          <div className="relative">
            <div
              className="flex items-center gap-1.5 cursor-pointer p-1 rounded-lg hover:bg-white/10 transition-all"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <img className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover border border-purple-500/50" src={userimage} alt="User Profile" />
              <img className={`w-2.5 md:w-3 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`} src={dropdown_icon} alt="dropdown arrow" />
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div
                className="absolute right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 backdrop-blur-xl rounded-xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in slide-in-from-top-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-2 border-b border-neutral-700/50 mb-1">
                  <p className="text-sm font-semibold text-white truncate">{user.name || "User"}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email || ""}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/my-profile");
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs md:text-sm text-gray-200 hover:bg-neutral-700/60 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  My Profile
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-1.5 text-xs md:text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-2 font-medium cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg font-medium text-xs md:text-sm transition-all shadow-md cursor-pointer"
          >
            Sign In
          </button>
        )}

        {/* Mobile Hamburger Button */}
        {token && user && (
          <button
            className="lg:hidden p-1.5 rounded-lg text-gray-200 hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => setOpenSideMenu((prev) => !prev)}
            aria-label="Toggle Navigation Menu"
          >
            {openSideMenu ? <HiOutlineX className="text-xl" /> : <HiOutlineMenu className="text-xl" />}
          </button>
        )}
      </div>

      {/* Mobile Drawer Navigation */}
      {openSideMenu && (
        <div className="fixed inset-x-4 top-14 bg-neutral-900/95 backdrop-blur-2xl border border-neutral-800 p-6 rounded-2xl shadow-2xl lg:hidden z-40 space-y-3">
          <NavLink
            to="/dashboard"
            onClick={() => setOpenSideMenu(false)}
            className="block px-4 py-3 rounded-xl bg-neutral-800/50 hover:bg-indigo-600/20 text-white font-medium transition-all"
          >
            Home
          </NavLink>
          <NavLink
            to="/income"
            onClick={() => setOpenSideMenu(false)}
            className="block px-4 py-3 rounded-xl bg-neutral-800/50 hover:bg-emerald-600/20 text-white font-medium transition-all"
          >
            Income
          </NavLink>
          <NavLink
            to="/expense"
            onClick={() => setOpenSideMenu(false)}
            className="block px-4 py-3 rounded-xl bg-neutral-800/50 hover:bg-rose-600/20 text-white font-medium transition-all"
          >
            Expenses
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
