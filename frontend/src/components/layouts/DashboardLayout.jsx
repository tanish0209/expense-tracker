import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const DashboardLayout = ({ activeMenu, children }) => {
  const { user } = useContext(AppContext);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 pt-4 md:pt-6 pb-6 md:pb-12 text-white">
      {activeMenu === "Dashboard" && (
        <h2 className="text-base sm:text-lg md:text-xl pb-2 md:pb-4 font-bold tracking-wide text-gray-100">
          Hi{user?.name ? `, ${user.name} 👋` : " 👋"}
        </h2>
      )}
      {children}
    </div>
  );
};

export default DashboardLayout;
