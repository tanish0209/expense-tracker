import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import { useNavigate, NavLink } from "react-router-dom";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="text-primary flex items-center justify-around py-3 border-b border-b-gray-400">
      <button
        className="block lg:hidden"
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>
      {openSideMenu && (
        <div className="fixed top-[61px] bg-white">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
      <div className="rounded-3xl py-2.5 px-3 border border-gray-100">
        <p className="font-extrabold text-md">EAZYTRACK</p>
      </div>
      <ul className="hidden md:flex gap-30 text-lg font-bold">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `py-1 text-center ${isActive ? "text-primary" : ""}`
          }
        >
          <li>
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
          <li>
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
          <li>
            Expense
            {window.location.pathname === "/expense" && (
              <hr className="border-none outline-none h-0.5 bg-primary w-4/5 m-auto" />
            )}
          </li>
        </NavLink>
      </ul>

      <div>
        <p>User Profile</p>
      </div>
    </div>
  );
};

export default Navbar;
