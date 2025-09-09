import React, { useContext, useEffect, useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import userimage from "../../assets/userimage.png";
import dropdown_icon from "../../assets/dropdown_icon.png";
import { useNavigate, NavLink } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";

const Navbar = ({ activeMenu }) => {
  const { token, user, setUser, clearUser, backendUrl } =
    useContext(AppContext);
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const logout = () => {
    clearUser;
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <div className="sticky top-5 py-3 px-2 md:px-8 md:w-fit w-10/12 text-primary bg-white/10 flex place-self-center items-center justify-center gap-5 sm:gap-10 md:gap-20  border-b-gray-400 z-10 backdrop-blur-lg rounded-2xl">
      {/* mobile menu */}
      {token && user ? (
        <button
          className="block lg:hidden z-30"
          onClick={() => setOpenSideMenu((prev) => !prev)}
        >
          {openSideMenu ? (
            <HiOutlineX className="text-2xl" />
          ) : (
            <HiOutlineMenu className="text-2xl" />
          )}
        </button>
      ) : (
        ""
      )}

      <div
        className={`${
          openSideMenu ? "fixed" : "hidden"
        } lg:hidden left-0 top-0 w-fit h-fit z-20 pt-14 `}
      >
        <ul className="flex flex-col items-center gap-2 mt-5 sticky bg-neutral-700 backdrop-blur-2xl text-lg border-b-gray-400 z-80 rounded-2xl font-medium">
          <NavLink to={"/dashboard"} onClick={() => setOpenSideMenu(false)}>
            <p className="px-4 py-2 rounded inline-block ">Home</p>
          </NavLink>
          <NavLink to={"/income"} onClick={() => setOpenSideMenu(false)}>
            <p className="px-4 py-2 rounded inline-block">Income</p>
          </NavLink>
          <NavLink to={"/expense"} onClick={() => setOpenSideMenu(false)}>
            <p className="px-4 py-2 rounded inline-block">Expenses</p>
          </NavLink>
        </ul>
      </div>
      <button
        className=" rounded-3xl py-2.5 px-3 border hover:bg-primary hover:text-secondary border-gray-100 transition-all duration-300"
        onClick={() => navigate("/dashboard")}
      >
        <p className="font-extrabold text-md">EAZYTRACK</p>
      </button>

      <ul className="hidden lg:flex gap-4 text-lg font-bold ">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `py-1 text-center ${isActive ? "text-primary" : ""}`
          }
        >
          <li className="hover:bg-gray-500 py-1.5 px-4 rounded-md transition-all duration-100">
            Home
            {window.location.pathname === "/dashboard" && (
              <hr className="border-none outline-none h-0.5 bg-primary w-4/5 m-auto" />
            )}
          </li>
        </NavLink>

        <NavLink
          to="/income"
          className={({ isActive }) =>
            `py-1 text-center ${isActive ? "text-primary" : ""}`
          }
        >
          <li className="hover:bg-gray-500 py-1.5 px-4 rounded-md transition-all duration-100">
            Income
            {window.location.pathname === "/income" && (
              <hr className="border-none outline-none h-0.5 bg-primary w-4/5 m-auto" />
            )}
          </li>
        </NavLink>

        <NavLink
          to="/expense"
          className={({ isActive }) =>
            `py-1 text-center ${isActive ? "text-primary" : ""}`
          }
        >
          <li className="hover:bg-gray-500 py-1.5 px-4 rounded-md transition-all duration-100">
            Expense
            {window.location.pathname === "/expense" && (
              <hr className="border-none outline-none h-0.5 bg-primary w-4/5 m-auto" />
            )}
          </li>
        </NavLink>
      </ul>

      <div>
        {token && user ? (
          <div
            className="flex items-center gap-2 cursor-pointer group z-50 relative"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <img className="w-8 rounded-full" src={userimage} alt="" />
            <img className="w-2.5" src={dropdown_icon} alt="" />
            <div
              className={`absolute top-0 -right-10 sm:-right-32 md:-right-8 pt-14 text-base font-medium text-gray-300 ${
                showDropdown ? "block" : "hidden"
              } group-hover:block`}
            >
              <div className="min-w-48 bg-neutral-700 backdrop-blur rounded-2xl z-10 flex flex-col gap-4 p-4 ">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-primary cursor-pointer w-full h-full"
                >
                  My Profile
                </p>
                <p
                  onClick={() => logout()}
                  className="hover:text-primary cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-secondary px-8 py-4 rounded-full font-medium hidden md:block"
          >
            Create Account
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
