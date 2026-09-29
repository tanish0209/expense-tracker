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
    <>
      {/* Top Main Navigation Header */}
      <header className="sticky top-3 z-40 w-full max-w-7xl mx-auto px-3 sm:px-6">
        <nav className="w-full px-4 sm:px-6 py-2.5 bg-neutral-800/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between gap-4 shadow-xl transition-all">
          {/* Brand Logo */}
          <button
            className="text-white text-base md:text-lg font-extrabold tracking-wider cursor-pointer hover:opacity-90 transition-opacity"
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
                  `px-3 py-1.5 rounded-lg transition-all duration-200 ${
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
                  `px-3 py-1.5 rounded-lg transition-all duration-200 ${
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
                  `px-3 py-1.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-rose-600/30 text-rose-400 font-bold border border-rose-500/30 shadow-sm"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                Expenses
              </NavLink>

              <NavLink
                to="/accounts"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-purple-600/30 text-purple-400 font-bold border border-purple-500/30 shadow-sm"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                Accounts
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
                  <img
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover border border-purple-500/50"
                    src={userimage}
                    alt="User Profile"
                  />
                  <img
                    className={`w-2.5 md:w-3 transition-transform duration-200 ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                    src={dropdown_icon}
                    alt="dropdown arrow"
                  />
                </div>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 backdrop-blur-xl rounded-xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in slide-in-from-top-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-3 py-2 border-b border-neutral-700/50 mb-1">
                      <p className="text-sm font-semibold text-white truncate">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email || ""}
                      </p>
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
                onClick={() => setOpenSideMenu(true)}
                aria-label="Open Navigation Menu"
              >
                <HiOutlineMenu className="text-2xl" />
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Traditional Mobile Sidebar Drawer (Rendered outside header to avoid backdrop-filter trapped context) */}
      {token && user && (
        <>
          {/* Backdrop Overlay */}
          {openSideMenu && (
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[99] lg:hidden animate-in fade-in duration-200"
              onClick={() => setOpenSideMenu(false)}
            />
          )}

          {/* Slide-over Sidebar Panel */}
          <div
            className={`fixed top-0 left-0 bottom-0 h-full w-72 max-w-[80vw] bg-neutral-900 border-r border-neutral-800 p-6 z-[100] flex flex-col justify-between shadow-2xl lg:hidden transition-transform duration-300 ease-in-out ${
              openSideMenu ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="space-y-6">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <button
                  className="text-white text-base font-extrabold tracking-wider"
                  onClick={() => {
                    setOpenSideMenu(false);
                    navigate("/dashboard");
                  }}
                >
                  EAZYTRACK
                </button>
                <button
                  onClick={() => setOpenSideMenu(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <HiOutlineX className="text-xl" />
                </button>
              </div>

              {/* User Info Card */}
              <div className="flex items-center gap-3 p-3 bg-neutral-800/60 rounded-xl border border-neutral-700/50">
                <img
                  src={userimage}
                  alt="User Profile"
                  className="w-10 h-10 rounded-full object-cover border border-purple-500/50 shrink-0"
                />
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user.email || ""}
                  </p>
                </div>
              </div>

              {/* Navigation Menu Links */}
              <div className="space-y-1">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                  Navigation
                </p>
                <NavLink
                  to="/dashboard"
                  onClick={() => setOpenSideMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? "bg-indigo-600/20 text-indigo-400 font-semibold border border-indigo-500/30"
                        : "text-gray-300 hover:bg-neutral-800/80 hover:text-white"
                    }`
                  }
                >
                  Home
                </NavLink>

                <NavLink
                  to="/income"
                  onClick={() => setOpenSideMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? "bg-emerald-600/20 text-emerald-400 font-semibold border border-emerald-500/30"
                        : "text-gray-300 hover:bg-neutral-800/80 hover:text-white"
                    }`
                  }
                >
                  Income
                </NavLink>

                <NavLink
                  to="/expense"
                  onClick={() => setOpenSideMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? "bg-rose-600/20 text-rose-400 font-semibold border border-rose-500/30"
                        : "text-gray-300 hover:bg-neutral-800/80 hover:text-white"
                    }`
                  }
                >
                  Expenses
                </NavLink>

                <NavLink
                  to="/accounts"
                  onClick={() => setOpenSideMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? "bg-purple-600/20 text-purple-400 font-semibold border border-purple-500/30"
                        : "text-gray-300 hover:bg-neutral-800/80 hover:text-white"
                    }`
                  }
                >
                  Accounts & Wallets
                </NavLink>

                <NavLink
                  to="/my-profile"
                  onClick={() => setOpenSideMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? "bg-neutral-800 text-white font-semibold border border-neutral-700"
                        : "text-gray-300 hover:bg-neutral-800/80 hover:text-white"
                    }`
                  }
                >
                  My Profile
                </NavLink>
              </div>
            </div>

            {/* Sidebar Footer Logout */}
            <div className="pt-4 border-t border-neutral-800">
              <button
                onClick={() => {
                  setOpenSideMenu(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
