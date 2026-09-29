import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const DashboardLayout = ({ activeMenu, children }) => {
  const { user } = useContext(AppContext);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12 text-white">
      {activeMenu === "Dashboard" && (
        <h2 className="text-lg md:text-xl py-4 font-bold tracking-wide text-gray-100">
          Hi{user?.name ? `, ${user.name} 👋` : " 👋"}
        </h2>
      )}
      {children}
    </div>
  );
};

export default DashboardLayout;
